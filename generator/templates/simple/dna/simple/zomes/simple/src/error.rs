use hdk3::prelude::*;

#[derive(thiserror::Error, Debug)]
pub enum SimpleError {
    #[error(transparent)]
    Serialization(#[from] SerializedBytesError),
    #[error(transparent)]
    EntryError(#[from] EntryError),
    #[error(transparent)]
    Wasm(#[from] WasmError),
    #[error(transparent)]
    HdkError(#[from] HdkError),
    #[error("Header that was just committed is missing. This means some went really wrong")]
    MissingLocalHeader,
    #[error("Tried to use a header without an entry as for where it only makes sense to use a new entry header")]
    WrongHeaderType,
    #[error("Thing at path {0} doesn't exist")]
    MissingThing(String),
    #[error("Some is fatally wrong with this app\n Please post a bug report on the repo\n Error: {0}")]
    DataFormatError(&'static str),
}

pub type SimpleResult<T> = Result<T, SimpleError>;
