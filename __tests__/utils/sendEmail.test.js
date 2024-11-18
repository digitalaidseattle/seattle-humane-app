import { sendEmail } from "@utils/sendEmail";
import { Resend } from "resend";

jest.mock('resend', () => {
   return {
      Resend: jest.fn().mockImplementation(() => {
         return {
            emails: {
               send: jest.fn(),
            },
         };
      }),
   };
});

const mockResend = new Resend('testkey');
const resend = mockResend.emails.send; 

describe('sendEmail', () => {
   process.env.RESEND_API_KEY = "test-key";
   process.env.RESEND_FROM_EMAIL = "testemail";
   process.env.RESEND_TO_EMAIL = "testemail";

   it('should send an email successfully', async () => {
      // Arrange: Set up the mock response
      const mockData = { success: true };
      resend.mockResolvedValueOnce({ data: mockData, error: null });

      const from = 'from@example.com';
      const to = 'to@example.com';
      const subject = 'Test Subject';
      const body = '<div>Test Body</div>'; 

      // Act: Call the sendEmail function
      const result = await sendEmail(mockResend, from, to, subject, body);

      // Assert: Check that the result matches the mock data
      expect(result).toEqual(mockData);
      expect(resend).toHaveBeenCalledWith({
         from,
         to,
         subject,
         react: body,
      });
   });

   it('should throw an error if the email send fails', async () => {
      // Arrange: Set up the mock error response
      const mockError = { message: 'Failed to send email' };
      resend.mockResolvedValueOnce({ data: null, error: mockError });

      const from = 'from@example.com';
      const to = 'to@example.com';
      const subject = 'Test Subject';
      const body = '<div>Test Body</div>'; 

      // Act & Assert: Expect an error to be thrown
      await expect(sendEmail(mockResend, from, to, subject, body)).rejects.toThrow('Failed to send email');
   });

   it('should throw a default error message if no error message is provided', async () => {
      // Arrange: Set up the mock error without a message
      const resendError = { message: '' };
      resend.mockResolvedValueOnce({ data: null, error: resendError });

      const from = 'from@example.com';
      const to = 'to@example.com';
      const subject = 'Test Subject';
      const body = '<div>Test Body</div>'; 

      // Act & Assert: Expect the default error message to be thrown
      await expect(sendEmail(mockResend, from, to, subject, body)).rejects.toThrow('Failed to send email');
   });
});