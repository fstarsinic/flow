export interface Rule {
    condition: string;
    action: 'movenext' | 'skipto' | 'xfer' | 'xferAndReturn' | 'halt' | 'rollback';
    target?: string;
}

