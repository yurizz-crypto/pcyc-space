import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllEcclesias } from '@/lib/db/queries/ecclesias';
import { deleteEcclesiaAction } from '@/app/actions/ecclesias';
import { Church, Plus, Trash2, MapPin, Clock, UserCheck, Pencil } from 'lucide-react';

export default async function AdminEcclesiasPage() {
  const ecclesiaList = await getAllEcclesias();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c3324]">
            Philippine Ecclesia Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#707666]">
            Manage verified Christadelphian ecclesias displayed on the Home page, About directory, Footer, and Member Registration.
          </p>
        </div>
        <Link href="/admin/ecclesias/new">
          <Button variant="primary" className="gap-2 shadow-xs">
            <Plus className="h-4 w-4" />
            <span>Add New Ecclesia</span>
          </Button>
        </Link>
      </div>

      {/* Directory Table / Cards */}
      <Card className="border-[#e6dfcb]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">All Ecclesias ({ecclesiaList.length})</CardTitle>
              <CardDescription>Live database records of Philippine fellowships.</CardDescription>
            </div>
            <Badge variant="gold" size="sm">
              {ecclesiaList.length} Active Fellowships
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {ecclesiaList.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Church className="h-10 w-10 text-[#8a9180] mx-auto" />
              <p className="text-sm font-semibold text-[#2c3324]">No ecclesias in database</p>
              <p className="text-xs text-[#707666]">
                Click &ldquo;Add New Ecclesia&rdquo; above to register a fellowship in the directory.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {ecclesiaList.map((ecc) => (
                <div
                  key={ecc.id}
                  className="p-5 rounded-2xl bg-white border border-[#e6dfcb] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif font-bold text-lg text-[#2c3324]">{ecc.name}</h3>
                      <Badge
                        variant={
                          ecc.region === 'Luzon'
                            ? 'gold'
                            : ecc.region === 'Visayas'
                            ? 'cream'
                            : 'forest'
                        }
                        size="sm"
                      >
                        {ecc.region}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#505748]">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#e0a861] shrink-0 mt-0.5" />
                        <span>{ecc.address}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#e0a861] shrink-0 mt-0.5" />
                        <span>{ecc.meetingSchedule}</span>
                      </div>
                      {ecc.contactPerson && (
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="h-3.5 w-3.5 text-[#8a9180] shrink-0" />
                          <span>Contact: {ecc.contactPerson}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <Link href={`/admin/ecclesias/${ecc.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 border-[#e6dfcb] text-[#505748] hover:text-[#2c3324]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>
                    </Link>

                    <form action={deleteEcclesiaAction}>
                      <input type="hidden" name="id" value={ecc.id} />
                      <Button
                        type="submit"
                        variant="destructive"
                        size="sm"
                        className="gap-1.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
