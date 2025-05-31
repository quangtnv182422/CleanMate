using CleanMate_Main.Server.Models.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CleanMate_Main.Server.Models.DbContext
{
    public partial class CleanMateMainDbContext : IdentityDbContext<AspNetUser, AspNetRole, string>
    {
        public CleanMateMainDbContext()
        {
        }
        public CleanMateMainDbContext(DbContextOptions<CleanMateMainDbContext> options)
      : base(options) { }




        public virtual DbSet<Booking> Bookings { get; set; }

        public virtual DbSet<BookingStatus> BookingStatuses { get; set; }

        public virtual DbSet<CleanerProfile> CleanerProfiles { get; set; }

        public virtual DbSet<CustomerAddress> CustomerAddresses { get; set; }

        public virtual DbSet<Duration> Durations { get; set; }

        public virtual DbSet<Feedback> Feedbacks { get; set; }

        public virtual DbSet<Payment> Payments { get; set; }

        public virtual DbSet<Service> Services { get; set; }

        public virtual DbSet<ServicePrice> ServicePrices { get; set; }

        public virtual DbSet<UserVoucher> UserVouchers { get; set; }

        public virtual DbSet<Voucher> Vouchers { get; set; }

        public virtual DbSet<UserWallet> UserWallets { get; set; }

        public virtual DbSet<WalletTransaction> WalletTransactions { get; set; }

        public virtual DbSet<WithdrawRequest> WithdrawRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Booking>(entity =>
            {
                entity.HasKey(e => e.BookingId).HasName("PK__Booking__73951AED83D6EF22");

                entity.ToTable("Booking");

                entity.Property(e => e.AddressId).HasColumnName("AddressId");
                entity.Property(e => e.CleanerId).HasMaxLength(450);
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime");
                entity.Property(e => e.Note).HasMaxLength(255);
                entity.Property(e => e.ServicePriceId).HasColumnName("Service_PriceId");
                entity.Property(e => e.TotalPrice).HasColumnType("decimal(10, 2)");
                entity.Property(e => e.UpdatedAt)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime");
                entity.Property(e => e.UserId).HasMaxLength(450);

                entity.HasOne(d => d.BookingStatus).WithMany(p => p.Bookings)
                    .HasForeignKey(d => d.BookingStatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Booking__Booking__0B91BA14");

                entity.HasOne(d => d.Cleaner).WithMany(p => p.BookingCleaners)
                    .HasForeignKey(d => d.CleanerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Booking__Cleaner__09A971A2");

                entity.HasOne(d => d.ServicePrice).WithMany(p => p.Bookings)
                    .HasForeignKey(d => d.ServicePriceId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Booking__Service__08B54D69");

                entity.HasOne(d => d.User).WithMany(p => p.BookingUsers)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Booking__UserId__0A9D95DB");

                entity.HasOne(d => d.Address)
                    .WithMany(p => p.Bookings)
                    .HasForeignKey(d => d.AddressId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Booking_CustomerAddress");
            });

            modelBuilder.Entity<BookingStatus>(entity =>
            {
                entity.HasKey(e => e.BookingStatusId).HasName("PK__Booking___54F9C05DC19E46C4");

                entity.ToTable("Booking_Status");

                entity.Property(e => e.Status).HasMaxLength(50);
                entity.Property(e => e.StatusDescription).HasMaxLength(255);
            });

            modelBuilder.Entity<CleanerProfile>(entity =>
            {
                entity.HasKey(e => e.CleanerId).HasName("PK__Cleaner___408F3436F8F474A9");

                entity.ToTable("Cleaner_Profile");

                entity.Property(e => e.Area).HasMaxLength(255);
                entity.Property(e => e.Available).HasDefaultValue(false);
                entity.Property(e => e.ExperienceYear).HasColumnName("Experience_YEAR");
                entity.Property(e => e.UserId).HasMaxLength(450);

                entity.HasOne(d => d.User).WithMany(p => p.CleanerProfiles)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Cleaner_P__UserI__03F0984C");
            });

            modelBuilder.Entity<CustomerAddress>(entity =>
            {
                entity.HasKey(e => e.AddressId).HasName("PK__Customer__091C2AFB3B54A574");

                entity.ToTable("Customer_Address");

                entity.Property(e => e.UserId).HasMaxLength(450);
                entity.Property(e => e.GG_FormattedAddress)
                        .HasMaxLength(450) 
                        .IsUnicode(true);
                entity.Property(e => e.GG_DispalyName)
                        .HasMaxLength(450)
                        .IsUnicode(true);
                entity.Property(e => e.GG_PlaceId)
                        .HasMaxLength(450);
                entity.Property(e => e.AddressNo)
                        .HasMaxLength(450)
                        .IsUnicode(true);
                entity.Property(e => e.IsInUse).HasDefaultValue(false);
                entity.Property(e => e.IsDefault).HasDefaultValue(false);
                entity.Property(e => e.Latitude).HasColumnType("decimal(20, 17)");
                entity.Property(e => e.Longitude).HasColumnType("decimal(20, 17)");


                entity.HasOne(d => d.User).WithMany(p => p.CustomerAddresses)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Customer___UserI__797309D9");
            });

            modelBuilder.Entity<Duration>(entity =>
            {
                entity.HasKey(e => e.DurationId).HasName("PK__Duration__AF77E836629F8EB9");

                entity.ToTable("Duration");

                entity.Property(e => e.SquareMeterSpecific).HasMaxLength(255);
                entity.Property(e => e.DurationTime).HasColumnName("DurationTime");
            });

            modelBuilder.Entity<Feedback>(entity =>
            {
                entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDD68825A544");

                entity.ToTable("Feedback");

                entity.Property(e => e.CleanerId).HasMaxLength(450);
                entity.Property(e => e.Content).HasMaxLength(255);
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime");
                entity.Property(e => e.UpdatedAt)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime");
                entity.Property(e => e.UserId).HasMaxLength(450);

                entity.HasOne(d => d.Booking).WithMany(p => p.Feedbacks)
                    .HasForeignKey(d => d.BookingId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Feedback__Bookin__10566F31");

                entity.HasOne(d => d.Cleaner).WithMany(p => p.FeedbackCleaners)
                    .HasForeignKey(d => d.CleanerId)
                    .HasConstraintName("FK__Feedback__Cleane__123EB7A3");

                entity.HasOne(d => d.User).WithMany(p => p.FeedbackUsers)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__Feedback__UserId__114A936A");
            });

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.PaymentId).HasName("PK__Payment__9B556A38F361AE19");

                entity.ToTable("Payment");

                entity.Property(e => e.Amount).HasColumnType("decimal(10, 2)");
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime");
                entity.Property(e => e.PaymentMethod).HasMaxLength(50);
                entity.Property(e => e.PaymentStatus)
                    .HasMaxLength(50)
                    .HasColumnName("Payment_Status");
                entity.Property(e => e.TransactionId).HasMaxLength(100);

                entity.HasOne(d => d.Booking).WithMany(p => p.Payments)
                    .HasForeignKey(d => d.BookingId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Payment__Booking__160F4887");
            });

            modelBuilder.Entity<Service>(entity =>
            {
                entity.HasKey(e => e.ServiceId).HasName("PK__Service__C51BB00A2FD83140");

                entity.ToTable("Service");

                entity.Property(e => e.Description);
                entity.Property(e => e.Name).HasMaxLength(100);
            });

            modelBuilder.Entity<ServicePrice>(entity =>
            {
                entity.HasKey(e => e.PriceId).HasName("PK__Service___49575BAF3F8AE4AE");

                entity.ToTable("Service_Price");

                entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");

                entity.HasOne(d => d.Duration).WithMany(p => p.ServicePrices)
                    .HasForeignKey(d => d.DurationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Service_P__Durat__73BA3083");

                entity.HasOne(d => d.Service).WithMany(p => p.ServicePrices)
                    .HasForeignKey(d => d.ServiceId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Service_P__Servi__74AE54BC");
            });

            modelBuilder.Entity<UserVoucher>(entity =>
            {
                entity.HasKey(e => e.UserVoucherId).HasName("PK__User_Vou__8017D499A0476362");

                entity.ToTable("User_Voucher");

                entity.Property(e => e.UserId).HasMaxLength(450);

                entity.HasOne(d => d.User).WithMany(p => p.UserVouchers)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__User_Vouc__UserI__7F2BE32F");

                entity.HasOne(d => d.Voucher).WithMany(p => p.UserVouchers)
                    .HasForeignKey(d => d.VoucherId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__User_Vouc__Vouch__00200768");
            });

            modelBuilder.Entity<Voucher>(entity =>
            {
                entity.HasKey(e => e.VoucherId).HasName("PK__Voucher__3AEE7921AB741345");

                entity.ToTable("Voucher");

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime");
                entity.Property(e => e.Description).HasMaxLength(255);
                entity.Property(e => e.DiscountPercentage)
                    .HasColumnType("decimal(5, 2)")
                    .HasColumnName("Discount_Percentage");
            });

            modelBuilder.Entity<UserWallet>(entity =>
            {
                entity.HasKey(e => e.WalletId);
                entity.Property(e => e.Balance).HasColumnType("decimal(18,2)");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

                entity.HasOne(e => e.User)
                    .WithOne(u => u.Wallet)
                    .HasForeignKey<UserWallet>(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_UserWallet_User");
            });

            modelBuilder.Entity<WalletTransaction>(entity =>
            {
                entity.HasKey(e => e.TransactionId);

                entity.Property(e => e.Amount)
                    .HasColumnType("decimal(18,2)");

                entity.Property(e => e.TransactionType)
                    .HasConversion<string>()             
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(e => e.Description)
                    .HasMaxLength(255);

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("(getdate())");

                entity.HasOne(e => e.Wallet)
                    .WithMany(w => w.Transactions)
                    .HasForeignKey(e => e.WalletId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_WalletTransaction_Wallet");
            });

            modelBuilder.Entity<WithdrawRequest>(entity =>
            {
                entity.ToTable("WithdrawRequest");

                entity.HasIndex(e => e.TransactionId).IsUnique();

                entity.Property(e => e.Status)
                    .HasConversion<string>() 
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(e => e.Amount)
                    .HasColumnType("decimal(18,2)");

                entity.Property(e => e.RequestedAt)
                    .HasDefaultValueSql("(getdate())");

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Withdraw_User");

                entity.HasOne(e => e.Admin)
                    .WithMany()
                    .HasForeignKey(e => e.ProcessedBy)
                    .HasConstraintName("FK_Withdraw_Admin");

                entity.HasOne(e => e.Wallet)
                    .WithMany()
                    .HasForeignKey(e => e.WalletId)
                    .HasConstraintName("FK_Withdraw_Wallet");

                entity.HasOne(e => e.Transaction)
                    .WithMany()
                    .HasForeignKey(e => e.TransactionId)
                    .HasConstraintName("FK_Withdraw_Transaction");
            });


            OnModelCreatingPartial(modelBuilder);
        }
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
