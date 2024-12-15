import { getUserRequestSchema, UserInclude } from './users.schema';

describe('User Schema', () => {
  describe('Validation of get user request', () => {
    it('should pass with valid array of includes', () => {
      const validData = {
        include: [UserInclude.LENDINGS, UserInclude.RESERVATIONS],
      };
      const result = getUserRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should pass with a single valid include as string', () => {
      const validData = { include: UserInclude.LENDINGS };
      const result = getUserRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ include: [UserInclude.LENDINGS] });
      }
    });

    it('should pass with mixed-case valid include', () => {
      const validData = { include: 'LeNDinGs' };
      const result = getUserRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          include: [UserInclude.LENDINGS.toLowerCase()],
        });
      }
    });

    it('should fail with an invalid include value', () => {
      const invalidData = { include: ['invalidInclude'] };
      const result = getUserRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Invalid enum value. Expected 'lendings' | 'reservations'",
        );
      }
    });

    it('should pass when include is null', () => {
      const validData = { include: null };
      const result = getUserRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should pass when include is undefined', () => {
      const validData = {};
      const result = getUserRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should pass when include is empty', () => {
      const validData = { include: [] };
      const result = getUserRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should normalize include values to lowercase', () => {
      const validData = { include: ['LENDINGS', 'ReSeRvAtIoNs'] };
      const result = getUserRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ include: ['lendings', 'reservations'] });
      }
    });
  });
});
