use hdk3::prelude::*;
use crate::{
    error::SimpleResult
};
pub mod handlers;

/// The actual thing data that is saved into the DHT
/// This is the data that can change.
#[hdk_entry(id = "thing_entry")]
#[derive(Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ThingEntry {
    uuid: String,
    name: String,
    location: String,
    parent: String,
}

/// A channel is consists of the category it belongs to
/// and a unique id
#[derive(Debug, Clone, Serialize, Deserialize, SerializedBytes)]
#[serde(rename_all = "camelCase")]
pub struct Thing {
    uuid: String,
    name: String,
    location: String,
    parent: String,
    entry_hash: EntryHash,
}

/// Input to the list things call
#[derive(Serialize, Deserialize, SerializedBytes)]
pub struct ThingListInput {
    parent: String,
}

/// The things returned from list things
#[derive(Serialize, Deserialize, SerializedBytes, derive_more::From)]
pub struct ThingList {
    things: Vec<Thing>,
}

impl Thing {
    pub fn new(entry: ThingEntry, entry_hash: EntryHash) -> SimpleResult<Thing> {
        Ok(Thing{
            uuid: entry.uuid,
            name: entry.name,
            location: entry.location,
            parent: entry.parent,
            entry_hash,
        })
    }
} 
