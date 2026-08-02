import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';

import {Voterregistry} from '../../../entity/Voterregistry';
import {VoterregistryService} from '../../../service/VoterregistryService';
import {AuthorizationManager} from '../../../service/authorizationmanager';

import {UiAssist} from '../../../util/ui/ui.assist';
import {MessageComponent} from '../../../util/dialog/message/message.component';
import {ConfirmComponent} from '../../../util/dialog/confirm/confirm.component';

@Component({
  selector: 'app-voterregistry',
  templateUrl: './voterregistry.component.html',
  styleUrls: ['./voterregistry.component.css']
})
export class VoterregistryComponent implements OnInit {

  // ── Household summary table ────────────────────────────────────────────────
  hhcolumns: string[] = ['householdno', 'address', 'votercount'];
  hhheaders: string[] = ['Household No', 'Address', 'Eligible Voters'];

  cshhcolumns: string[] = ['cshhno', 'csaddr', 'cscount'];
  cshhprompts: string[] = ['Search No', 'Search Address', 'Search Count'];

  householdSummary: any[]  = [];
  hhdata!: MatTableDataSource<any>;
  selectedHousehold: any   = null;

  @ViewChild('hhpaginator') hhpaginator!: MatPaginator;

  // ── Voter list table ───────────────────────────────────────────────────────
  votercolumns: string[] = ['serialno', 'name', 'namewithinitials', 'nic', 'dateofbirth', 'mobileno', 'action'];
  voterheaders: string[] = ['Serial No', 'Full Name', 'Name w/ Initials', 'NIC', 'Date of Birth', 'Mobile', 'Action'];
  voterbinders: string[] = ['serialno', 'citizen.name', 'citizen.namewithinitials', 'citizen.nic', 'citizen.dateofbirth', 'citizen.mobileno', ''];

  csvotercolumns: string[] = ['csserial', 'csname', 'csnic', 'csdob'];
  csvoterprompts: string[] = ['Search Serial', 'Search Name', 'Search NIC', 'Search DOB'];

  voters: Voterregistry[]  = [];
  voterdata!: MatTableDataSource<Voterregistry>;
  selectedVoter: any       = null;

  @ViewChild('voterpaginator') voterpaginator!: MatPaginator;

  // ── Search forms ───────────────────────────────────────────────────────────
  cshhsearch!: FormGroup;
  csvotersearch!: FormGroup;

  // ── Stats ──────────────────────────────────────────────────────────────────
  totalVoters: number      = 0;
  totalHouseholds: number  = 0;
  registryDate: string     = '';
  imageurl: string         = '';

  uiassist: UiAssist;

  hasInsertAuthority: boolean = false;
  hasDeleteAuthority: boolean = false;

  constructor(
    private vrs: VoterregistryService,
    private fb: FormBuilder,
    private dg: MatDialog,
    public authService: AuthorizationManager,
  ) {
    this.uiassist = new UiAssist(this);

    this.cshhsearch = this.fb.group({
      'cshhno':  new FormControl(),
      'csaddr':  new FormControl(),
      'cscount': new FormControl(),
    });

    this.csvotersearch = this.fb.group({
      'csserial': new FormControl(),
      'csname':   new FormControl(),
      'csnic':    new FormControl(),
      'csdob':    new FormControl(),
    });
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.imageurl = 'assets/pending.gif';
    this.loadHouseholdSummary();
    this.loadTotalCount();
    this.voters = [];
    this.voterdata = new MatTableDataSource(this.voters);

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
  }

  // ── Load household summary table ───────────────────────────────────────────
  loadHouseholdSummary(): void {
    this.vrs.getHouseholdSummary()
      .then((data: any[]) => {
        this.householdSummary = data;
        this.totalHouseholds  = data.length;
        this.imageurl         = 'assets/fullfilled.png';
      })
      .catch(error => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.hhdata = new MatTableDataSource(this.householdSummary);
        this.hhdata.paginator = this.hhpaginator;
      });
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'voterregistry' && authority.operation === 'insert');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'voterregistry' && authority.operation === 'delete');
  }

  // ── Load total count stat ──────────────────────────────────────────────────
  loadTotalCount(): void {
    this.vrs.getTotalCount().then((res: any) => {
      this.totalVoters = res.totalvoters ?? 0;
    });
  }

  // ── Click household row — load its voters ─────────────────────────────────
  selectHousehold(row: any): void {
    this.selectedHousehold = row;
    this.vrs.getByHousehold(row.householdId)
      .then((entries: Voterregistry[]) => {
        this.voters = entries;
        if (entries.length > 0) {
          this.registryDate = entries[0].registereddate;
        }
      })
      .finally(() => {
        this.voterdata = new MatTableDataSource(this.voters);
        this.voterdata.paginator = this.voterpaginator;
      });
  }

  // ── Client-side filter — household table ───────────────────────────────────
  filterHouseholdTable(): void {
    const cs = this.cshhsearch.getRawValue();
    this.hhdata.filterPredicate = (h: any) => {
      return (cs.cshhno == null || h.householdno?.toLowerCase().includes(cs.cshhno)) &&
        (cs.csaddr == null || h.address?.toLowerCase().includes(cs.csaddr));
    };
    this.hhdata.filter = 'xx';
  }

  // ── Client-side filter — voter table ──────────────────────────────────────
  filterVoterTable(): void {
    const cs = this.csvotersearch.getRawValue();
    this.voterdata.filterPredicate = (v: Voterregistry) => {
      return (cs.csserial == null || String(v.serialno).includes(cs.csserial)) &&
        (!cs.csname || v.citizen?.name.toLowerCase().includes(cs.csname.toLowerCase())   == null || v.citizen?.name.toLowerCase().includes(cs.csname)) &&
        (cs.csnic    == null || (v.citizen?.nic ?? '').toLowerCase().includes(cs.csnic)) &&
        (cs.csdob == null ||
          new Date(v.citizen!.dateofbirth).toDateString() ===
          new Date(cs.csdob).toDateString())
    };
    this.voterdata.filter = 'xx';
  }

  // ── Generate registry ──────────────────────────────────────────────────────
  generate(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: 'Confirmation - Generate Voter Registry',
        message: 'This will <strong>clear the existing registry</strong> and regenerate it ' +
          'from all eligible citizens (age ≥ 18, Active status). <br><br>Are you sure to proceed?'
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.imageurl = 'assets/pending.gif';
        let genstatus = false;
        let genmessage = 'Server Not Found';

        this.vrs.generate().then((response: any) => {
          if (response != undefined) {
            genstatus = response['errors'] == '';
            if (!genstatus) genmessage = response['errors'];
            else genmessage = `Voter Registry Generated Successfully. <br><br>
                               <strong>${response['generated']}</strong> eligible voters registered.`;
          } else {
            genstatus = false;
            genmessage = 'Content Not Found';
          }
        }).finally(() => {
          if (genstatus) {
            this.loadHouseholdSummary();
            this.loadTotalCount();
            // Refresh voter table if a household was selected
            if (this.selectedHousehold) {
              this.selectHousehold(this.selectedHousehold);
            }
          }
          this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: 'Status - Generate Registry', message: genmessage}
          });
        });
      }
    });
  }

  // ── Remove voter entry manually ────────────────────────────────────────────
  removeVoter(entry: Voterregistry): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: 'Confirmation - Remove Voter',
        message: `Are you sure to remove <strong>${entry.citizen?.name}</strong> from the voter registry?`
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus = false;
        let delmessage = 'Server Not Found';
        this.vrs.delete(entry.id).then((response: [] | undefined) => {
          if (response != undefined) {
            // @ts-ignore
            delstatus = response['errors'] == '';
            // @ts-ignore
            if (!delstatus) delmessage = response['errors'];
          } else {
            delstatus = false; delmessage = 'Content Not Found';
          }
        }).finally(() => {
          if (delstatus) {
            delmessage = entry.citizen?.name + ' removed from registry.';
            this.loadHouseholdSummary();
            this.loadTotalCount();
            if (this.selectedHousehold) this.selectHousehold(this.selectedHousehold);
          }
          this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: 'Status - Remove Voter', message: delmessage}
          });
        });
      }
    });
  }

  // ── Clear selection ────────────────────────────────────────────────────────
  clearSelection(): void {
    this.selectedHousehold = null;
    this.selectedVoter     = null;
    this.voters            = [];
    this.voterdata         = new MatTableDataSource(this.voters);
    this.cshhsearch.reset();
    this.csvotersearch.reset();
    this.loadHouseholdSummary();
    this.loadTotalCount();
  }
}
