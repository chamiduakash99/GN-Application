package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.sql.Date;
import java.util.Arrays;
import java.util.Objects;

@Entity
public class Certificate {
    public Certificate() {
    }

    public Certificate(Integer id, String certificateno) {
        this.id = id;
        this.certificateno = certificateno;
    }

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;

    // NOTE: Java field/property renamed from "cetificateno" to "certificateno"
    // to match the JSON key every Angular client (GN officer + citizen) sends.
    // @Column(name = "cetificateno") is kept as-is on purpose — that is the
    // actual MySQL column name, no DB schema change is needed for this fix.
    @Basic
    @Column(name = "cetificateno")
    private String certificateno;

    @Basic
    @Column(name = "issueddate")
    private Date issueddate;
    @Basic
    @Column(name = "expirydate")
    private Date expirydate;
    @JsonIgnore
    @Basic
    @Column(name = "scannedcopy")
    private byte[] scannedcopy;
    @Basic
    @Column(name = "hardcopypicked")
    private Byte hardcopypicked;
    @Basic
    @Column(name = "pickeddate")
    private Date pickeddate;

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    @JsonIgnoreProperties({"users","certificatesById","announcementsById","complaints","idcardrequests"})
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "certificaterequest_id", referencedColumnName = "id", nullable = false)
    @JsonIgnoreProperties({"citizen","certificates","certificaterequests"})
    private Certificaterequest certificaterequest;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCertificateno() {
        return certificateno;
    }

    public void setCertificateno(String certificateno) {
        this.certificateno = certificateno;
    }

    public Date getIssueddate() {
        return issueddate;
    }

    public void setIssueddate(Date issueddate) {
        this.issueddate = issueddate;
    }

    public Date getExpirydate() {
        return expirydate;
    }

    public void setExpirydate(Date expirydate) {
        this.expirydate = expirydate;
    }

    public byte[] getScannedcopy() {
        return scannedcopy;
    }

    public void setScannedcopy(byte[] scannedcopy) {
        this.scannedcopy = scannedcopy;
    }

    @Transient
    @JsonProperty("hasscannedcopy")
    public boolean hasScannedcopy() {
        return this.scannedcopy != null && this.scannedcopy.length > 0;
    }

    public Byte getHardcopypicked() {
        return hardcopypicked;
    }

    public void setHardcopypicked(Byte hardcopypicked) {
        this.hardcopypicked = hardcopypicked;
    }

    public Date getPickeddate() {
        return pickeddate;
    }

    public void setPickeddate(Date pickeddate) {
        this.pickeddate = pickeddate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Certificate that = (Certificate) o;
        return Objects.equals(id, that.id) && Objects.equals(certificateno, that.certificateno) && Objects.equals(issueddate, that.issueddate) && Objects.equals(expirydate, that.expirydate) && Arrays.equals(scannedcopy, that.scannedcopy) && Objects.equals(hardcopypicked,
                that.hardcopypicked) && Objects.equals(pickeddate, that.pickeddate);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(id, certificateno, issueddate, expirydate, hardcopypicked, pickeddate);
        result = 31 * result + Arrays.hashCode(scannedcopy);
        return result;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Certificaterequest getCertificaterequest() {
        return certificaterequest;
    }

    public void setCertificaterequest(Certificaterequest certificaterequest) {
        this.certificaterequest = certificaterequest;
    }
}

//package lk.earth.earthuniversity.entity;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//
//import javax.persistence.*;
//import java.sql.Date;
//import java.util.Arrays;
//import java.util.Objects;
//
//@Entity
//public class Certificate {
//    public Certificate() {
//    }
//
//    public Certificate(Integer id, String cetificateno) {
//        this.id = id;
//        this.cetificateno = cetificateno;
//    }
//
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Id
//    @Column(name = "id")
//    private Integer id;
//    @Basic
//    @Column(name = "cetificateno")
//    private String cetificateno;
//    @Basic
//    @Column(name = "issueddate")
//    private Date issueddate;
//    @Basic
//    @Column(name = "expirydate")
//    private Date expirydate;
//    @JsonIgnore
//    @Basic
//    @Column(name = "scannedcopy")
//    private byte[] scannedcopy;
//    @Basic
//    @Column(name = "hardcopypicked")
//    private Byte hardcopypicked;
//    @Basic
//    @Column(name = "pickeddate")
//    private Date pickeddate;
//
//    @ManyToOne
//    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
//    @JsonIgnoreProperties({"users","certificatesById","announcementsById","complaints","idcardrequests"})
//    private Employee employee;
////    @ManyToOne
////    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
////    private Employee employee;
//
//    @ManyToOne
//    @JoinColumn(name = "certificaterequest_id", referencedColumnName = "id", nullable = false)
//    @JsonIgnoreProperties({"citizen","certificates","certificaterequests"})
//    private Certificaterequest certificaterequest;
////    @ManyToOne
////    @JoinColumn(name = "certificaterequest_id", referencedColumnName = "id", nullable = false)
////    private Certificaterequest certificaterequest;
//
//    public Integer getId() {
//        return id;
//    }
//
//    public void setId(Integer id) {
//        this.id = id;
//    }
//
//    public String getCetificateno() {
//        return cetificateno;
//    }
//
//    public void setCetificateno(String cetificateno) {
//        this.cetificateno = cetificateno;
//    }
//
//    public Date getIssueddate() {
//        return issueddate;
//    }
//
//    public void setIssueddate(Date issueddate) {
//        this.issueddate = issueddate;
//    }
//
//    public Date getExpirydate() {
//        return expirydate;
//    }
//
//    public void setExpirydate(Date expirydate) {
//        this.expirydate = expirydate;
//    }
//
//    public byte[] getScannedcopy() {
//        return scannedcopy;
//    }
//
//    public void setScannedcopy(byte[] scannedcopy) {
//        this.scannedcopy = scannedcopy;
//    }
//
//    public Byte getHardcopypicked() {
//        return hardcopypicked;
//    }
//
//    public void setHardcopypicked(Byte hardcopypicked) {
//        this.hardcopypicked = hardcopypicked;
//    }
//
//    public Date getPickeddate() {
//        return pickeddate;
//    }
//
//    public void setPickeddate(Date pickeddate) {
//        this.pickeddate = pickeddate;
//    }
//
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        Certificate that = (Certificate) o;
//        return Objects.equals(id, that.id) && Objects.equals(cetificateno, that.cetificateno) && Objects.equals(issueddate, that.issueddate) && Objects.equals(expirydate, that.expirydate) && Arrays.equals(scannedcopy, that.scannedcopy) && Objects.equals(hardcopypicked, that.hardcopypicked) && Objects.equals(pickeddate, that.pickeddate);
//    }
//
//    @Override
//    public int hashCode() {
//        int result = Objects.hash(id, cetificateno, issueddate, expirydate, hardcopypicked, pickeddate);
//        result = 31 * result + Arrays.hashCode(scannedcopy);
//        return result;
//    }
//
//    public Employee getEmployee() {
//        return employee;
//    }
//
//    public void setEmployee(Employee employee) {
//        this.employee = employee;
//    }
//
//    public Certificaterequest getCertificaterequest() {
//        return certificaterequest;
//    }
//
//    public void setCertificaterequest(Certificaterequest certificaterequest) {
//        this.certificaterequest = certificaterequest;
//    }
//}
