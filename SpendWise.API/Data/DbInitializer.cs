using SpendWise.API.Models;

namespace SpendWise.API.Data;

public class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        // check if db is already seeded
        if (context.Categories.Any())
        {
            return;
        }
        
        // Seed Categories
        var categories = new Category[]
        {
            // Expenses Categories
            new Category() { Name = "Groceries" },
            new Category() { Name = "Transportation" },
            new Category() { Name = "Entertainment" },
            new Category() { Name = "Utilities" },
            new Category() { Name = "Healthcare" },
            new Category() { Name = "Dining Out" },
            new Category() { Name = "Shopping" },
            new Category() { Name = "Education" },
            new Category() { Name = "Housing" },
            new Category() { Name = "Insurance" },

            // Income Categories
            new Category() { Name = "Salary" },
            new Category() { Name = "Freelance" },
            new Category() { Name = "Investments" },
            new Category() { Name = "Gifts" },

            // Others
            new Category() { Name = "Other Income" },
            new Category() { Name = "Other Expense" }
        };
        
        context.Categories.AddRange(categories);
        context.SaveChanges();
        
        // Seed sample transactions to test API
        var salaryCateogy = categories.First((c => c.Name == "Salary"));
        var groceriesCategory =  categories.First((c => c.Name == "Groceries"));
        var transportationCategory = categories.First((c => c.Name == "Transportation"));

        var transactions = new Transaction[]
        {
            new Transaction()
            {
                Date = DateTime.Now.AddDays(-10),
                Amount = 5000.00m,
                Description = "Monthly Salary",
                Type = TransactionType.Income,
                CategoryId = salaryCateogy.Id,
            },
            new Transaction
            {
                Date = DateTime.Now.AddDays(-5),
                Amount = 2350.50m,
                Description = "Weekly grocery shopping",
                Type = TransactionType.Expense,
                CategoryId = groceriesCategory.Id
            },
            new Transaction
            {
                Date = DateTime.Now.AddDays(-3),
                Amount = 800.00m,
                Description = "Gas for car",
                Type = TransactionType.Expense,
                CategoryId = transportationCategory.Id,
            },
            new Transaction
            {
                Date = DateTime.Now.AddDays(-1),
                Amount = 55.25m,
                Description = "Groceries - abarrotes",
                Type = TransactionType.Expense,
                CategoryId = groceriesCategory.Id
            }
        };
        
        context.Transactions.AddRange(transactions);
        context.SaveChanges();
    }
}