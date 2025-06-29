export class Image {
  static getPngSize(buffer: Buffer | Uint8Array) {
    const width =
      (buffer[16] << 24) | (buffer[17] << 16) | (buffer[18] << 8) | buffer[19];
    const height =
      (buffer[20] << 24) | (buffer[21] << 16) | (buffer[22] << 8) | buffer[23];
    return { width, height };
  }

  static getJpegSize(buffer: Buffer | Uint8Array) {
    let i = 2;
    while (i < buffer.length) {
      if (buffer[i] === 0xff && buffer[i + 1] === 0xc0) {
        const height = (buffer[i + 5] << 8) | buffer[i + 6];
        const width = (buffer[i + 7] << 8) | buffer[i + 8];
        return { width, height };
      }
      i++;
    }
    return undefined;
  }

  static getGifSize(buffer: Buffer | Uint8Array) {
    const width = buffer[6] | (buffer[7] << 8);
    const height = buffer[8] | (buffer[9] << 8);
    return { width, height };
  }

  static getWebpSize(buffer: Buffer | Uint8Array) {
    if (
      buffer[12] === 0x56 &&
      buffer[13] === 0x50 &&
      buffer[14] === 0x38 &&
      buffer[15] === 0x58
    ) {
      const width =
        1 + ((buffer[24] | (buffer[25] << 8) | (buffer[26] << 16)) & 0xffffff);
      const height =
        1 + ((buffer[27] | (buffer[28] << 8) | (buffer[29] << 16)) & 0xffffff);
      return { width, height };
    }
    if (
      buffer[12] === 0x56 &&
      buffer[13] === 0x50 &&
      buffer[14] === 0x38 &&
      buffer[15] === 0x20
    ) {
      const width = buffer[26] | ((buffer[27] & 0x3f) << 8);
      const height = buffer[28] | ((buffer[29] & 0x3f) << 8);
      return { width, height };
    }
    if (
      buffer[12] === 0x56 &&
      buffer[13] === 0x50 &&
      buffer[14] === 0x38 &&
      buffer[15] === 0x4c
    ) {
      const b0 = buffer[21];
      const b1 = buffer[22];
      const b2 = buffer[23];
      const b3 = buffer[24];
      const width = 1 + (((b1 & 0x3f) << 8) | b0);
      const height = 1 + (((b3 & 0xf) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
      return { width, height };
    }
    return undefined;
  }

  static getSvgSize(buffer: Buffer | Uint8Array) {
    try {
      const text =
        buffer instanceof Buffer
          ? buffer.toString("utf8")
          : Buffer.from(buffer).toString("utf8");
      const match = text.match(
        /<svg[^>]*\swidth=["']?(\d+)[^\d][^>]*height=["']?(\d+)/i
      );
      if (match) {
        const width = parseInt(match[1], 10);
        const height = parseInt(match[2], 10);
        return { width, height };
      }
    } catch {}
    return undefined;
  }

  static getImageType(
    buffer: Buffer | Uint8Array
  ): "png" | "jpeg" | "gif" | "webp" | "svg" | undefined {
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    )
      return "png";
    if (buffer[0] === 0xff && buffer[1] === 0xd8) return "jpeg";
    if (
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x38 &&
      (buffer[4] === 0x39 || buffer[4] === 0x37)
    )
      return "gif";
    if (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    )
      return "webp";
    if (
      buffer[0] === 0x3c &&
      buffer[1] === 0x73 &&
      buffer[2] === 0x76 &&
      buffer[3] === 0x67
    )
      return "svg";
    return undefined;
  }

  static getImageSizeFromBuffer(
    buffer: Buffer | Uint8Array
  ): { width: number; height: number } | undefined {
    const type = this.getImageType(buffer);
    if (type === "png") return this.getPngSize(buffer);
    if (type === "jpeg") return this.getJpegSize(buffer);
    if (type === "gif") return this.getGifSize(buffer);
    if (type === "webp") return this.getWebpSize(buffer);
    if (type === "svg") return this.getSvgSize(buffer);
    return undefined;
  }
}
