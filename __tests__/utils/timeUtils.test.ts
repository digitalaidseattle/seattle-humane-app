import { daysAgo, getWeekStartDate } from "@utils/timeUtils";

describe("timeUtils", () => {
  const mockDate = (date: string) => {
    let mockedDate = new Date(date);
    jest.setSystemTime(mockedDate);
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("getWeekStartDate", () => {
    const expected = new Date("2024-07-21Z").toISOString(); // Sunday

    it("should return Sunday as the start of the week if today is Monday", () => {
      // Arrange: Mock current date as Monday, 22 July 2024
      mockDate("2024-07-22Z");
      // Act
      const actual = getWeekStartDate().toISOString();
      // Assert
      expect(actual).toEqual(expected);
    });

    it("should return Sunday as the start of the week if today is Friday", () => {
      // Arrange: Mock current date as Friday, 26 July 2024
      mockDate("2024-07-26Z");
      // Act
      const actual = getWeekStartDate().toISOString();
      // Assert
      expect(actual).toEqual(expected);
    });

    it("should return Sunday as the start of the week if today is Sunday", () => {
      // Arrange: Mock current date as Sunday, 21 July 2024
      mockDate("2024-07-21Z");
      // Act
      const actual = getWeekStartDate().toISOString();
      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe("daysAgo", () => {
    it("should return the correct date for 7 days ago", () => {
      // Arrange: Mock current date as 24 July 2024
      mockDate("2024-07-24Z"); 
      // Act
      const result = daysAgo(7).toISOString();
      const expected = new Date("2024-07-17Z").toISOString(); // 7 days before
      // Assert
      expect(result).toBe(expected);
    });

    it("should return the current date for 0 days ago", () => {
      // Arrange: Mock current date as 24 July 2024
      mockDate("2024-07-24Z"); 
      // Act
      const result = daysAgo(0).toISOString();
      const expected = new Date("2024-07-24Z").toISOString(); // Current date
      // Assert
      expect(result).toBe(expected);
    });

    it("should handle negative numbers correctly", () => {
      // Arrange: Mock current date as 24 July 2024
      mockDate("2024-07-24Z"); 
      // Act
      const result = daysAgo(-5).toISOString();
      const expected = new Date("2024-07-29Z").toISOString(); // 5 days in the future
      // Assert
      expect(result).toBe(expected);
    });
  });
});
