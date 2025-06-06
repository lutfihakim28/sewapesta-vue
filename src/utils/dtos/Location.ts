export class Location {
  subdistrict: string;
  subdistrictCode: string;
  district: string;
  districtCode: string;
  city: string;
  cityCode: string;
  province: string;
  provinceCode: string;

  constructor(data: Location) {
    this.subdistrict = data.subdistrict;
    this.subdistrictCode = data.subdistrictCode;
    this.district = data.district;
    this.districtCode = data.districtCode;
    this.city = data.city;
    this.cityCode = data.cityCode;
    this.province = data.province;
    this.provinceCode = data.provinceCode;
  }
}
