export function skippedFilesText(skippedFiles: any[]) {
    const names = skippedFiles.slice(0, 3)
        .map(file => file.name);
    const rest = skippedFiles.slice(4, skippedFiles.length)
        .length;

return `The following files are not supported by this platform and have been removed: \n ${names.join(", ")} ${!!rest ? `and ${rest} more` : ''}`;      
}