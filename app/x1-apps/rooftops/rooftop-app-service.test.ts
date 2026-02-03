import { RoofTopAppService } from "./rooftop-app.service";
import { UIComponentType } from "~/shared-constants/admin.enums";
import {
  ROOFTOP_COLUMNS_CONFIG,
  ROOFTOP_TABLE_CONFIG,
  ROOFTOP_TABLE_ACTIONS,
  ROOFTOP_TABLE_HEADING
} from "~/x1-apps/rooftops/rooftop-settings";
import { TABLE_NAMES } from "~/shared-constants/contstants";

describe("RoofTopAppService", () => {
  let service: RoofTopAppService;
  beforeEach(() => {
    service = new (RoofTopAppService as any)();
  });

  it("builds rooftop table with correct query and configuration", async () => {
    // Mock query builder chain
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
    };

    // Mock final return from buildDataTable
    const mockTableResult = { type: "MOCK_TABLE_RESULT" };

    jest.spyOn(service as any, "sql_query").mockReturnValue(mockQueryBuilder);
    jest.spyOn(service as any, "buildDataTable").mockResolvedValue(mockTableResult);

    const result = await service.RoofTopList();

    //Ensure correct table requested
    expect(service["sql_query"]).toHaveBeenCalledWith(TABLE_NAMES.ROOFTOP);
    // Ensure correct columns selected
    expect(mockQueryBuilder.select).toHaveBeenCalledWith(
      "rt_dealer_id",
      "rt_name",
      "rt_street",
      "rt_city",
      "rt_state",
      "rt_zip",
      "rt_ph"
    );
    //Ensure correct ordering
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith("rt_id", "desc");

    // Ensure correct config passed to table builder
    expect(service["buildDataTable"]).toHaveBeenCalledWith(
      expect.objectContaining({
        query: mockQueryBuilder,
        type: UIComponentType.TABLE,
        table_unique_id: TABLE_NAMES.ROOFTOP,
        columns: ROOFTOP_COLUMNS_CONFIG,
        configOverrides: ROOFTOP_TABLE_CONFIG,
        table_header: ROOFTOP_TABLE_HEADING,
        header_actions: ROOFTOP_TABLE_ACTIONS,
      })
    );

    // Ensure method returns builder result
    expect(result).toBe(mockTableResult);
  });
});
