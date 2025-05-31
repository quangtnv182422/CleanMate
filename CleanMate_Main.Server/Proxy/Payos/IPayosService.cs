using CleanMate_Main.Server.Models.DTO.Payos;
using Net.payOS.Types;

namespace CleanMate_Main.Server.Proxy.Payos
{
    public interface IPayosService
    {
        Task<CreatePaymentResult> CreatePayOSPaymentUrl(PaymentData paymentData);
        Task<PaymentLinkInformation> GetPaymentLinkInfor(long id);
        Task<PaymentLinkInformation> CancelPaymentLink(long orderCode, string cancellationReason);
        PaymentResultModel ProcessReturnUrl(IQueryCollection queryParams);
    }
}
