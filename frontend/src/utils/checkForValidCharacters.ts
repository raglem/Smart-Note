export default function checkForValidCharacters(name: string): boolean {
    const invalidCharPattern = /[^a-zA-Z0-9 \-_]/;
    return !invalidCharPattern.test(name);
}