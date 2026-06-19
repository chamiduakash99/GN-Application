package lk.earth.earthuniversity.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
public class Idcardrequest {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "bcnooridno")
    private String bcnooridno;
    @Basic
    @Column(name = "complaintdate")
    private Timestamp complaintdate;
    @Basic
    @Column(name = "complaintpolicestation")
    private String complaintpolicestation;
    @Basic
    @Column(name = "complaintno")
    private String complaintno;
    @Basic
    @Column(name = "applieddate")
    private Timestamp applieddate;
    @Basic
    @Column(name = "rejectreason")
    private String rejectreason;
    @ManyToOne
    @JoinColumn(name = "reason_id", referencedColumnName = "id", nullable = false)
    private Reason reason;
    @ManyToOne
    @JoinColumn(name = "idcardrequeststatus_id", referencedColumnName = "id", nullable = false)
    private Idcardrequeststatus idcardrequeststatus;
    @ManyToOne
    @JoinColumn(name = "citizen_id", referencedColumnName = "id", nullable = false)
    private Citizen citizen;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBcnooridno() {
        return bcnooridno;
    }

    public void setBcnooridno(String bcnooridno) {
        this.bcnooridno = bcnooridno;
    }

    public Timestamp getComplaintdate() {
        return complaintdate;
    }

    public void setComplaintdate(Timestamp complaintdate) {
        this.complaintdate = complaintdate;
    }

    public String getComplaintpolicestation() {
        return complaintpolicestation;
    }

    public void setComplaintpolicestation(String complaintpolicestation) {
        this.complaintpolicestation = complaintpolicestation;
    }

    public String getComplaintno() {
        return complaintno;
    }

    public void setComplaintno(String complaintno) {
        this.complaintno = complaintno;
    }

    public Timestamp getApplieddate() {
        return applieddate;
    }

    public void setApplieddate(Timestamp applieddate) {
        this.applieddate = applieddate;
    }

    public String getRejectreason() {
        return rejectreason;
    }

    public void setRejectreason(String rejectreason) {
        this.rejectreason = rejectreason;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Idcardrequest that = (Idcardrequest) o;
        return Objects.equals(id, that.id) && Objects.equals(bcnooridno, that.bcnooridno) && Objects.equals(complaintdate, that.complaintdate) && Objects.equals(complaintpolicestation, that.complaintpolicestation) && Objects.equals(complaintno, that.complaintno) && Objects.equals(applieddate, that.applieddate) && Objects.equals(rejectreason, that.rejectreason);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, bcnooridno, complaintdate, complaintpolicestation, complaintno, applieddate, rejectreason);
    }

    public Reason getReason() {
        return reason;
    }

    public void setReason(Reason reason) {
        this.reason = reason;
    }

    public Idcardrequeststatus getIdcardrequeststatus() {
        return idcardrequeststatus;
    }

    public void setIdcardrequeststatus(Idcardrequeststatus idcardrequeststatus) {
        this.idcardrequeststatus = idcardrequeststatus;
    }

    public Citizen getCitizen() {
        return citizen;
    }

    public void setCitizen(Citizen citizen) {
        this.citizen = citizen;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}
