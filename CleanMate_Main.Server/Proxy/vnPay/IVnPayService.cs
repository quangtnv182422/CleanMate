using CleanMate_Main.Server.Models.DTO.vnPay;

namespace CleanMate_Main.Server.Proxy.vnPay
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(PaymentInformationModel model, HttpContext context);
        PaymentResponseModel PaymentExecute(IQueryCollection collections);

    }
}
