import emailIsValid  from "@utils/dataValidationUtils";

describe("dataValidationUtils", () => {
  describe("emailIsInvalid", () => {

    it("should allow valid email", () => {
      const actual = emailIsValid('text@domain.co');
      expect(actual).toBe(true);
    });

    it("empty email are invalid", () => {
      const actual = emailIsValid('');
      expect(actual).toBe(false);
    });

    it("souldn't contain any spaces", () => {
      const actual = emailIsValid('te xt@domain.com')
      expect(actual).toEqual(false);
    });

    it("should not allow more than one @ sign", () => {
      let actual = emailIsValid('tex@t@domain.com');
      expect(actual).toEqual(false);
      actual = emailIsValid('text@@domain.com');
      expect(actual).toEqual(false);
    });

    it("should not allow email without a domain", () => {
      const actual = emailIsValid('text@');
      expect(actual).toEqual(false);
    });

    it("should not allow email with incomplete domain", () => {
      const actual = emailIsValid('text@.com');
      expect(actual).toEqual(false);
    });

    it("should not allow email with invalid domain", () => {
      const actual = emailIsValid('text@domain');
      expect(actual).toEqual(false);
    });

    it("should not allow email without a username", () => {
      const actual = emailIsValid('@domain.com');
      expect(actual).toEqual(false);
    });

    it("should allow emails with hyphens and periods", () => {
      const actual = emailIsValid('text.name@sub-domain.co.uk');
      expect(actual).toBe(true);
    });

    it("should allow valid emails with numbers", () => {
      const actual = emailIsValid('user123@domain123.com');
      expect(actual).toBe(true);
    });

  })
});