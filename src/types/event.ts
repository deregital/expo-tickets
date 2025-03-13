export interface Event {
  id: string;
  name: string;
  date: string;
  startingDate: string;
  endingDate: string;
  location: string;
  folderId: string | null;
  tagAssistedId: string;
  tagConfirmedId: string;
  active: boolean;
  supraEventId: string | null;
  created_at: string;
  updated_at: string;
  eventTickets: {
    id: string;
    amount: number;
    type: 'PARTICIPANT' | 'STAFF' | 'SPECTATOR';
    price: number | null;
  }[];
}

export interface Ticket {
  id: string;
  type: string;
  price: number;
  currency: string;
}
