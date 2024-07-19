export enum OwnerTypeEnum {
  Individu = 'Individu',
  Corporation = 'Corporation'
}

export const OwnerType = {
  Individu: 'Perorangan',
  Corporation: 'Perusahaan',
}

export const OwnerTypeOptions: Array<{
  value: OwnerTypeEnum,
  label: string,
}> = [
    {
      label: OwnerType[OwnerTypeEnum.Individu],
      value: OwnerTypeEnum.Individu
    },
    {
      label: OwnerType[OwnerTypeEnum.Corporation],
      value: OwnerTypeEnum.Corporation
    },
  ]