export function unfinishedChanges(event: BeforeUnloadEvent) {
    event.preventDefault();
    return event.returnValue = "";
}