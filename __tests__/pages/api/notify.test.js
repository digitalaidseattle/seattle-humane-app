import { Resend } from 'resend';
import { sendEmail } from '@utils/sendEmail';
import handler from '@pages/api/notify';

jest.mock('@utils/sendEmail', () => ({
  sendEmail: jest.fn(),
}));

describe('API handler', () => {
  let mockReq;
  let mockRes;

  const fromEmail = "test-from-email@example.com";
  const toEmail = "test-to-email@example.com";
  const category = "Service Category";
  const urgent = true;
  const createdAt = "2024-11-17T10:00:00Z";

  beforeEach(() => {
    mockReq = {
      method: 'POST',
      body: { category, urgent, createdAt },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    process.env.RESEND_FROM_EMAIL = fromEmail;
    process.env.RESEND_TO_EMAIL = toEmail;
    process.env.RESEND_API_KEY = "test-api-key";
  });

  it('should return 405 if method is not POST', async () => {
    mockReq.method = 'GET';

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Method not allowed. Use POST." });
  });

  it('should return 400 if required fields are missing', async () => {
    mockReq.body = { category: '', urgent, createdAt }; 

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Missing required fields: category, urgent, or createdAt." });
  });

  it('should return 500 if environment variables are not configured', async () => {
    delete process.env.RESEND_FROM_EMAIL;
    delete process.env.RESEND_TO_EMAIL;
    delete process.env.RESEND_API_KEY;

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Env vars are not configured correctly.' });
  });

  it('should return 500 if an error occurs during email sending', async () => {
    sendEmail.mockRejectedValueOnce(new Error("Failed to send email"));

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error.' });
  });

  it('should successfully send an email and return a success response', async () => {
    const mockEmailData = { success: true };
    sendEmail.mockResolvedValueOnce(mockEmailData);

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockEmailData);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.any(Resend),
      fromEmail,
      toEmail,
      `New [Urgent] Service Request Notification`,
      expect.anything(),
    );
  });
});
