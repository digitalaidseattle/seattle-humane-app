enum AppConstants {
  Category = 'category',
  Status = 'status',
  Source = 'source',
  Species = 'species',
}

enum TicketStatus {
  Open = 'open',
  Closed = 'closed',
}

/**
 * Disabled prefer-default-export as more constant/enum vars will be added in the future
 * and exporting a named var avoids needing to update import statements when more are added
 */

export { TicketStatus, AppConstants };
