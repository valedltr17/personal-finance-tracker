# personal-finance-tracker
A full-stack web application that allows users to track their income and expenses, categorize transactions, and view financial summaries and trends.

Personal Finance Tracker - "SpendWise"
🎯 Project Overview
A full-stack web application that allows users to track their income and expenses, categorize transactions, and view financial summaries and trends.

Estimated Completion Time: 1 week

🛠 Tech Stack
Backend: C# with ASP.NET Core Web API (.NET 6/8)

Frontend: Angular (v16+)

Database: SQL Server / PostgreSQL with Entity Framework Core

State Management: RxJS with BehaviorSubject

UI Components: Angular Material

Version Control: Git

📋 Core Features & User Stories
1. Transaction Management
✅ View list of all transactions (Income & Expenses)

✅ Add new transactions with Date, Amount, Description, and Category

✅ Edit existing transactions

✅ Delete transactions

2. Category Management
✅ View list of categories

✅ Create new categories (with pre-seeded common categories)

3. Dashboard
✅ View financial summary: Total Income, Total Expenses, Net Balance

✅ Pie chart showing expenses by category

✅ Recent transactions list

📅 Weekly Development Plan
Day 1: Database & Backend Foundation
Set up ASP.NET Core Web API project

Design and implement Data Models

Configure Entity Framework Core with DbContext

Create and run database migrations

Seed initial categories

Day 2: Angular Setup & Core Architecture
Set up Angular project with proper structure

Create core modules (App, Shared, Feature modules)

Implement core services with HttpClient

Set up reactive state management with BehaviorSubject

Day 3: Transaction CRUD Operations
Build TransactionList component

Create TransactionForm component (Reactive Forms)

Implement full CRUD operations

Connect frontend to backend APIs

Day 4: Dashboard & Analytics
Create Dashboard component

Implement summary calculations

Integrate chart library (Chart.js/NGX-Charts)

Build recent transactions widget

Day 5: Polish & Final Touches
Apply styling with Angular Material

Add loading indicators and error handling

Implement form validation

Code review and final testing

🏗 Technical Specifications
Backend Architecture
Data Models
// Category Model
public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public ICollection<Transaction> Transactions { get; set; }
}

// Transaction Model
public class Transaction
{
    public int Id { get; set; }
    public DateTime Date { get; set; } = DateTime.Now;
    public decimal Amount { get; set; }
    public string Description { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; }
}

API Endpoints
GET /api/transactions - Get all transactions

POST /api/transactions - Create new transaction

PUT /api/transactions/{id} - Update transaction

DELETE /api/transactions/{id} - Delete transaction

GET /api/categories - Get all categories

GET /api/dashboard/summary - Get dashboard data

Data Transfer Objects (DTOs)

public class DashboardSummaryDto
{
    public decimal TotalIncome { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal NetBalance { get; set; }
    public List<CategorySummaryDto> ExpenseByCategory { get; set; }
    public List<TransactionReadDto> RecentTransactions { get; set; }
}

Frontend Architecture
Angular Structure

src/
├── app/
│   ├── core/
│   ├── shared/
│   ├── transactions/
│   │   ├── transaction-list/
│   │   ├── transaction-form/
│   │   └── transactions.service.ts
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   └── dashboard.service.ts
│   └── categories/

State Management

// Example service with BehaviorSubject
@Injectable()
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();
  
  // State management methods
  updateTransactions(transactions: Transaction[]) {
    this.transactionsSubject.next(transactions);
  }
}

✅ Success Criteria
Backend Excellence
Clean architecture with proper separation of concerns

Async/await pattern implementation

Efficient EF Core usage (no N+1 queries)

Proper HTTP status codes and API responses

Input validation and error handling

Frontend Excellence
Well-structured components and modules

Effective RxJS and Observable usage

Reactive Forms with validation

Centralized HTTP error handling

Reactive state management

Database Excellence
Efficient schema design

Proper EF Core migrations

Foreign key relationships

Seeding strategy

General Development Practices
Clear Git commit history

Readable and maintainable code

All user stories completed and functional

🚀 Bonus Challenges
Completed these? You're ahead of the curve!

Advanced Filtering - Add date range and category filtering

User Authentication - Implement login/logout system

Testing - Write API integration tests with xUnit

Deployment Ready - Create Dockerfile and production setup

Advanced Analytics - Add monthly trends and forecasting

Export Functionality - Export transactions to CSV

🎯 Getting Started
Prerequisites
.NET 6/8 SDK

Node.js & npm

SQL Server / PostgreSQL

Angular CLI

Backend Setup
dotnet restore
dotnet ef database update
dotnet run

Frontend Setup
npm install
ng serve

📞 Evaluation Focus
We'll be looking for:

Code quality and maintainability

Architectural decisions and patterns

Problem-solving approach

Attention to user experience

Understanding of full-stack development concepts
