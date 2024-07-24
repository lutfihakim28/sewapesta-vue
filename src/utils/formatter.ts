import IMask from 'imask';

export const formatter = {
  currency: (unmasked: number) => {
    const mask = IMask.createMask({
      mask: Number,
      thousandsSeparator: '.',
      radix: ',',
      autofix: true,
    })

    mask.resolve(unmasked.toString());

    return mask;
  }
}