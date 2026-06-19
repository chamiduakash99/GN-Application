package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Certificaterequest {
    public Certificaterequest() {
    }

    public Certificaterequest(Integer id, String purpose) {
        this.id = id;
        this.purpose = purpose;
    }
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "purpose")
    private String purpose;
    @Basic
    @Column(name = "requesteddate")
    private Date requesteddate;
    @Basic
    @Column(name = "rejectreason")
    private String rejectreason;
    @Basic
    @Column(name = "updateddate")
    private Date updateddate;
    @JsonIgnore
    @OneToMany(mappedBy = "certificaterequest")
    private Collection<Certificate> certificates;
    @ManyToOne
    @JoinColumn(name = "citizen_id", referencedColumnName = "id", nullable = false)
    private Citizen citizen;
    @ManyToOne
    @JoinColumn(name = "certificatetype_id", referencedColumnName = "id", nullable = false)
    private Certificatetype certificatetype;
    @ManyToOne
    @JoinColumn(name = "requeststatus_id", referencedColumnName = "id", nullable = false)
    private Requeststatus requeststatus;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public Date getRequesteddate() {
        return requesteddate;
    }

    public void setRequesteddate(Date requesteddate) {
        this.requesteddate = requesteddate;
    }

    public String getRejectreason() {
        return rejectreason;
    }

    public void setRejectreason(String rejectreason) {
        this.rejectreason = rejectreason;
    }

    public Date getUpdateddate() {
        return updateddate;
    }

    public void setUpdateddate(Date updateddate) {
        this.updateddate = updateddate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Certificaterequest that = (Certificaterequest) o;
        return Objects.equals(id, that.id) && Objects.equals(purpose, that.purpose) && Objects.equals(requesteddate, that.requesteddate) && Objects.equals(rejectreason, that.rejectreason) && Objects.equals(updateddate, that.updateddate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, purpose, requesteddate, rejectreason, updateddate);
    }

    public Collection<Certificate> getCertificates() {
        return certificates;
    }

    public void setCertificates(Collection<Certificate> certificates) {
        this.certificates = certificates;
    }

    public Citizen getCitizen() {
        return citizen;
    }

    public void setCitizen(Citizen citizen) {
        this.citizen = citizen;
    }

    public Certificatetype getCertificatetype() {
        return certificatetype;
    }

    public void setCertificatetype(Certificatetype certificatetype) {
        this.certificatetype = certificatetype;
    }

    public Requeststatus getRequeststatus() {
        return requeststatus;
    }

    public void setRequeststatus(Requeststatus requeststatus) {
        this.requeststatus = requeststatus;
    }
}
