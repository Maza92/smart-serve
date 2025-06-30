import { UnitTypeEnum } from '@app/core/enums/unit-enum';

export interface Unit {
  id: number;
  name: string;
  abbreviation: string;
  unitType: UnitTypeEnum;
}
