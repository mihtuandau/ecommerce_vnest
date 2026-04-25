"use client";

import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { usersApi } from "@/features/users/api";
import { Search, User, Loader2, Mail, Phone, Check } from "lucide-react";

interface UserSelectorProps {
  onSelect: (user: any) => void;
}

export function UserSelector({ onSelect }: UserSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async (query = "") => {
    try {
      setIsLoading(true);
      const res = await usersApi.getUsers({ search: query, limit: 10 });
      setUsers(res || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(search);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="gap-2 bg-white shadow-sm hover:bg-slate-50 border-slate-200">
          <Search className="h-4 w-4" />
          Tìm khách hàng đã có
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[80vh] flex flex-col p-0 overflow-hidden border-none rounded-2xl shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold">Chọn khách hàng</DialogTitle>
          <form onSubmit={handleSearch} className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Tìm theo tên, email hoặc SĐT..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl border-slate-200"
            />
          </form>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="text-sm font-medium">Đang tìm khách hàng...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <User className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">Không tìm thấy khách hàng nào</p>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group"
                  onClick={() => {
                    onSelect(user);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 overflow-hidden border-2 border-white shadow-sm">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
                      ) : (
                        user.fullName?.charAt(0).toUpperCase() || <User className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{user.fullName || "Chưa đặt tên"}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
