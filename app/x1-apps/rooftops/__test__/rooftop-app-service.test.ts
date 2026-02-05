import { RoofTopAppService } from "~/x1-apps/rooftops/rooftop-app.service";
import { UIComponentType } from "~/shared-constants/admin.enums";
import { ROOFTOP_COLUMNS_CONFIG, ROOFTOP_TABLE_CONFIG, ROOFTOP_TABLE_HEADING } from "~/x1-apps/rooftops/rooftop-settings";
import { CLARITY_DATA_TABLE_UNIQUE_IDS, TABLE_NAMES } from "~/shared-constants/contstants";
type RooftopTableConfig = typeof ROOFTOP_TABLE_CONFIG;

describe("RoofTopAppService", () => {
  let service: RoofTopAppService;

  beforeEach(() => {
    service = new (RoofTopAppService as any)();
  });

  it("returns TABLE component with correctly mapped rooftop data", async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
    };

    jest.spyOn(service as any, "sql_query").mockReturnValue(mockQueryBuilder);
    const mockDbRows = [
      {
        rt_dealer_id: "R100",
        rt_name: "Sunshine Motors",
        rt_street: "123 Main St",
        rt_city: "Austin",
        rt_state: "TX",
        rt_zip: "78701",
        rt_ph: "512-555-1234",
      },
    ];

    jest.spyOn(service as any, "executeQuery").mockResolvedValue(mockDbRows);

    const result = await service.RoofTopList();

    expect(result.component_type).toBe(UIComponentType.TABLE);
    expect(result.payload.table_header).toBe(ROOFTOP_TABLE_HEADING);
    expect(result.payload.table_unique_id).toBe(CLARITY_DATA_TABLE_UNIQUE_IDS.ROOFTOP);
    expect(result.payload.columns).toEqual(ROOFTOP_COLUMNS_CONFIG);
    expect(result.payload.data).toHaveLength(1);

    const config = result.payload.config as RooftopTableConfig;
    expect(config.features.pagination.pageSize).toBe(
      ROOFTOP_TABLE_CONFIG.features.pagination.pageSize
    );

    expect((service as any).sql_query).toHaveBeenCalledWith(TABLE_NAMES.ROOFTOP);
    expect(mockQueryBuilder.select).toHaveBeenCalledWith(
      "rt_dealer_id",
      "rt_name",
      "rt_street",
      "rt_city",
      "rt_state",
      "rt_zip",
      "rt_ph"
    );
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith("rt_id", "desc");
  });
});
