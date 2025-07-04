﻿using CleanMate_Main.Server.Models.DTO.VietQR;
using System.Text;
using System.Text.Json;
using System.Web;

namespace CleanMate_Main.Server.Proxy.VietQR
{
    public class VietQRService : IVIetQRService
    {
        public async Task<string> GenerateQRCodeUrl(string bankId, string accountNo, decimal amount, string description)
        {
            string addInfo = string.Empty;
            if (string.IsNullOrEmpty(bankId))
            {
                throw new ArgumentException("Mã ngân hàng (BankID) không được để trống.");
            }
            if (string.IsNullOrEmpty(accountNo) || accountNo.Length < 6 || accountNo.Length > 19)
            {
                throw new ArgumentException("Số tài khoản phải từ 6 đến 19 ký tự.");
            }
            if (amount <= 0 || amount.ToString().Length > 13)
            {
                throw new ArgumentException("Số tiền phải lớn hơn 0 và không vượt quá 13 ký tự.");
            }
            string template = "print";
            if (string.IsNullOrEmpty(description) || description.Length > 50)
            {
                throw new ArgumentException("Mô tả phải từ 1 đến 50 ký tự.");
            }
            else
            {
                 addInfo = HttpUtility.UrlEncode(description);
            }

            // Construct the Quick Link URL
            string qrUrl = $"https://img.vietqr.io/image/{bankId}-{accountNo}-{template}.png?amount={(int)amount}&addInfo={addInfo}";
            return qrUrl;
        }
    }
}

