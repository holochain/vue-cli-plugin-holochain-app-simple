use entries::thing;
use error::SimpleResult;
use hdk3::prelude::Path;
use hdk3::prelude::*;
use thing::{ThingEntry, Thing, ThingListInput, ThingList};

mod entries;
mod error;

entry_defs![Path::entry_def(), ThingEntry::entry_def()];

#[hdk_extern]
fn create_thing(thing_entry: ThingEntry) -> SimpleResult<Thing> {
    thing::handlers::create_thing(thing_entry)
}

#[hdk_extern]
fn delete_thing(thing: Thing) -> SimpleResult<()> {
    thing::handlers::delete_thing(thing)
}

#[hdk_extern]
fn list_things(parent: ThingListInput) -> SimpleResult<ThingList> {
    thing::handlers::list_things(parent)
}
