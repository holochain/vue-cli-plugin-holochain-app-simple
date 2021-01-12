use crate::{
    error::SimpleResult,
    thing::{Thing, ThingEntry}
};
use hdk3::prelude::*;

use super::{ThingListInput, ThingList};

/// Create a new thing
pub(crate) fn create_thing(thing_entry: ThingEntry) -> SimpleResult<Thing> {
    let ThingEntry { parent, uuid, .. } = thing_entry.clone();
    let path: Path = Path::from(format!("{}.{}", parent, uuid));
    path.ensure()?;
    create_entry(&thing_entry)?;
    let entry_hash = hash_entry(&thing_entry)?;
    let _thing_link: HeaderHash = create_link(path.hash()?, entry_hash.clone(), ())?;
    Thing::new(thing_entry, entry_hash)
}

pub(crate) fn delete_thing(thing: Thing) -> SimpleResult<()> {
    // This is a workaround for now
    if let Some(Details::Entry(metadata::EntryDetails{headers,..})) = get_details(thing.entry_hash, GetOptions::default())?{
      if let Some(header) = headers.first(){
        delete_entry(header.header_address().clone())?;
      }
    }
    Ok(())
}

pub(crate) fn list_things(input: ThingListInput) -> SimpleResult<ThingList> {
    let parent_path = Path::from(input.parent);
    let thing_path_links = parent_path.children()?.into_inner();
    let mut things = Vec::with_capacity(thing_path_links.len());
    for thing_uuid in thing_path_links.into_iter().map(|link| link.target) {
    let mut links = get_links(thing_uuid, None)?.into_inner();
    links.sort_by_key(|l|l.timestamp);
    if let Some(thing_link_last) = links.last() {
         if let Some(element) = get(thing_link_last.target.clone(), GetOptions::default())? {
                if let Some(thing) = element.into_inner().1.to_app_option::<ThingEntry>()? {
                    things.push(Thing::new(thing.clone(), hash_entry(&thing)?)?);
                }
            }
        }
    }
    Ok(things.into())
}
