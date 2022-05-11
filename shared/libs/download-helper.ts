export class DownloadHelper {
  public static download(
    name: string,
    contentBytes: string,
    contentType: string
  ) {
    const bytes = this.base64ToArrayBuffer(contentBytes);
    const blob = new Blob([bytes], {
      type: contentType,
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = name;
    link.click();
  }

  private static base64ToArrayBuffer(base64: string) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
}
