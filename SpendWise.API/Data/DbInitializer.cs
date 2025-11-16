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
            new Category() { Name = "Groceries", Color = "#4ccf73" },
            new Category() { Name = "Transportation", Color = "#cf554c" },
            new Category() { Name = "Entertainment", Color = "#cf554c" },
            new Category() { Name = "Utilities", Color = "#6f4ccf" },
            new Category() { Name = "Healthcare", Color = "#4cbbcf" },
            new Category() { Name = "Dining Out", Color = "#cf4c92" },
            new Category() { Name = "Shopping", Color = "#cf4c78" },
            new Category() { Name = "Education", Color = "#4c68cf" },
            new Category() { Name = "Housing", Color = "#4c94cf" },
            new Category() { Name = "Insurance", Color = "#87cf4c" },

            // Income Categories
            new Category() { Name = "Salary", Color = "#4ccf53" },
            new Category() { Name = "Freelance", Color = "#b7cf4c" },
            new Category() { Name = "Investments", Color = "#cfac4c" },
            new Category() { Name = "Gifts", Color = "#cf4cae" },

            // Others
            new Category() { Name = "Other Income", Color = "#4ccfaa" },
            new Category() { Name = "Other Expense", Color = "#cf4c62" }
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