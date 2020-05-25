export namespace FileUtils {
    export function fileToBase64(file: File, callback: (fileInBase64: string) => void): void {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
            if (reader.result != null) {
                callback(reader.result as string)
            }
        }
        reader.onerror = function (error) {
            console.log('Error: ', error)
        }
        console.log(reader.result)
    }
}