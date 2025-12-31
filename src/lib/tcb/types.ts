// TCB Client Types

export interface DepositParams {
    gs1s: string[];
    mode?: 'base_gs1' | 'serialized';
    client_txn_id: string;
}

export interface DepositResponse {
    success: boolean;
    gs1s: string[];
    client_txn_id: string;
    error?: string;
}

export interface FetchCodeParams {
    gs1: string;
    validity_in_seconds: number;
}

export interface FetchCodeResponse {
    fetch_code: string;
    expires_at: Date;
}

export interface MasterOfferFile {
    mof_id: string;
    funder_id: string;
    gtin: string;
    discount_type: string;
    discount_value: number;
    start_date: string;
    end_date: string;
}

export interface TCBClient {
    deposit(params: DepositParams): Promise<DepositResponse>;
    createFetchCode(params: FetchCodeParams): Promise<FetchCodeResponse>;
    getMasterOfferFiles(): Promise<MasterOfferFile[]>;
}
