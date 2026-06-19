package lk.earth.earthuniversity.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
public class Complaint {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "subject")
    private String subject;
    @Basic
    @Column(name = "description")
    private String description;
    @Basic
    @Column(name = "complaineddate")
    private Timestamp complaineddate;
    @Basic
    @Column(name = "rejectreason")
    private String rejectreason;
    @Basic
    @Column(name = "actiontaken")
    private String actiontaken;
    @Basic
    @Column(name = "referredto")
    private String referredto;
    @ManyToOne
    @JoinColumn(name = "complaintstatus_id", referencedColumnName = "id", nullable = false)
    private Complaintstatus complaintstatus;
    @ManyToOne
    @JoinColumn(name = "citizen_id", referencedColumnName = "id", nullable = false)
    private Citizen citizen;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;

    public Complaint() {

    }

    public Complaint(Integer id, String subject) {this.id = id;this.subject = subject;}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Timestamp getComplaineddate() {
        return complaineddate;
    }

    public void setComplaineddate(Timestamp complaineddate) {
        this.complaineddate = complaineddate;
    }

    public String getRejectreason() {
        return rejectreason;
    }

    public void setRejectreason(String rejectreason) {
        this.rejectreason = rejectreason;
    }

    public String getActiontaken() {
        return actiontaken;
    }

    public void setActiontaken(String actiontaken) {
        this.actiontaken = actiontaken;
    }

    public String getReferredto() {
        return referredto;
    }

    public void setReferredto(String referredto) {
        this.referredto = referredto;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Complaint complaint = (Complaint) o;
        return Objects.equals(id, complaint.id) && Objects.equals(subject, complaint.subject) && Objects.equals(description, complaint.description) && Objects.equals(complaineddate, complaint.complaineddate) && Objects.equals(rejectreason, complaint.rejectreason) && Objects.equals(actiontaken, complaint.actiontaken) && Objects.equals(referredto, complaint.referredto);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, subject, description, complaineddate, rejectreason, actiontaken, referredto);
    }

    public Complaintstatus getComplaintstatus() {
        return complaintstatus;
    }

    public void setComplaintstatus(Complaintstatus complaintstatus) {
        this.complaintstatus = complaintstatus;
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
