import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendInviteMail(
  to: string,
  projectName: string,
  invitationId: string,
  projectId: string,
  inviteeId: string,
) {
  const acceptUrl = `${process.env.BACKEND_URL}/invitations/${invitationId}/accept?projectId=${projectId}&inviteeId=${inviteeId}`;
  const mailOptions = {
    from: `"Moonshot 팀" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: `[Moonshot] '${projectName}' 프로젝트 참여 초대장입니다.`,
    html: `
      <div style="font-family: 'Malgun Gothic', sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #00c73c; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #00c73c; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Moonshot Invitation</h1>
        </div>
        <div style="padding: 30px; color: #333; line-height: 1.6;">
          <p style="font-size: 16px;">안녕하세요!</p>
          <p>회원님은 <strong>${projectName}</strong> 프로젝트의 협업 멤버로 초대되었습니다.</p>
          <p>아래 버튼을 클릭하여 프로젝트 목록에서 초대를 <strong>수락</strong>해 주세요.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${acceptUrl}" style="background-color: #00c73c; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            초대 수락하기
            </a>
          </div>
          <p style="font-size: 12px; color: #999;">본 메일은 발신 전용입니다.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('네이버 메일 발송 성공:', info.messageId);
    return info;
  } catch (error) {
    console.error('네이버 메일 발송 실패:', error);
    throw error;
  }
}
