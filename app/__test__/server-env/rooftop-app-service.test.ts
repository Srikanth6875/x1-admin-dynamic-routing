import { RoofTopAppService } from "~/server/x1-apps/rooftops/rooftop-app-service";
import { UIComponentType } from "~/shared/admin.enums";
import {
  ROOFTOP_COLUMNS_CONFIG,
  ROOFTOP_TABLE_CONFIG,
  ROOFTOP_TABLE_HEADING,
} from "../../server/x1-apps/rooftops/rooftop-settings";
import { CLARITY_DATA_TABLE_UNIQUE_IDS, TABLE_NAMES } from "~/shared/contstants";

describe("RoofTopAppService", () => {
  let service: RoofTopAppService;

  beforeEach(() => {
    service = new (RoofTopAppService as any)();
  });

  it("builds rooftop table using correct query and config", async () => {
    // mock query builder
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
    };

    jest.spyOn(service as any, "query").mockReturnValue(mockQueryBuilder);

    const buildTableSpy = jest
      .spyOn(service as any, "BuildClarifyDataTable")
      .mockResolvedValue({
        component_type: UIComponentType.TABLE,
        payload: {
          table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.ROOFTOP,
          table_header: ROOFTOP_TABLE_HEADING,
          columns: ROOFTOP_COLUMNS_CONFIG,
          config: ROOFTOP_TABLE_CONFIG,
          data: [],
        },
      });

    const result = await service.RoofTopList();

    // query construction
    expect((service as any).query).toHaveBeenCalledWith(TABLE_NAMES.ROOFTOP);

    expect(mockQueryBuilder.select).toHaveBeenCalledWith(
      "rt_id",
      "rt_dealer_id",
      "rt_name",
      "rt_street",
      "rt_city",
      "rt_state",
      "rt_zip",
      "rt_ph"
    );

    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith("rt_id", "desc");

    // framework integration
    expect(buildTableSpy).toHaveBeenCalledWith({
      sqlQuery: mockQueryBuilder,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.ROOFTOP,
      columns: ROOFTOP_COLUMNS_CONFIG,
      configOverrides: ROOFTOP_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: ROOFTOP_TABLE_HEADING,
    });

    // final result shape
    expect(result.component_type).toBe(UIComponentType.TABLE);
    expect(result.payload.table_unique_id).toBe(
      CLARITY_DATA_TABLE_UNIQUE_IDS.ROOFTOP
    );
  });
});
