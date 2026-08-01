package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
public class Treecuttingrequest {

    public Treecuttingrequest() {
    }

    public Treecuttingrequest(Integer id, String deedno) {
        this.id = id;
        this.deedno = deedno;
    }


    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;


    @Basic
    @Column(name = "deedno")
    @Pattern(regexp = "^D\\d{3}$", message = "Invalid deed number format")
    private String deedno;


    @Basic
    @Column(name = "treecount")
    private Integer treecount;


    @Basic
    @Column(name = "reasonforcutting")
    private String reasonforcutting;


    @Basic
    @Column(name = "requesteddate")
    private Timestamp requesteddate;


    @Basic
    @Column(name = "rejectreason")
    private String rejectreason;


    @JsonIgnore
    @Lob
    @Column(name = "permitpdf")
    private byte[] permitpdf;


    @JsonIgnore
    @Lob
    @Column(name = "transportpdf")
    private byte[] transportpdf;


    @Basic
    @Column(name = "needstransport")
    private Boolean needstransport;


    @Basic
    @Column(name = "destination")
    private String destination;


    @Basic
    @Column(name = "vehicletype")
    private String vehicletype;


    @Basic
    @Column(name = "vehiclenumber")
    @Pattern(regexp = "^[A-Z]{2,3}-\\d{4}$", message = "Invalid vehicle number format")
    private String vehiclenumber;


    @Basic
    @Column(name = "transportdate")
    private String transportdate;


    @Basic
    @Column(name = "treecuttingrequestcol")
    private Timestamp treecuttingrequestcol;



    // Tree Type Relationship

    @ManyToOne
    @JoinColumn(name = "treetype_id", referencedColumnName = "id", nullable = false)
    private Treetype treetype;



    // Permission Status Relationship

    @ManyToOne
    @JoinColumn(name = "treepermissionstatus_id", referencedColumnName = "id", nullable = false)
    private Treepermissionstatus treepermissionstatus;



    // Citizen Relationship

    @ManyToOne
    @JoinColumn(name = "citizen_id", referencedColumnName = "id", nullable = false)
    @JsonIgnoreProperties({"religion","maritalstatus","educationlevel",
            "ethnicity","gender","birthcetificateno",
            "medicalconditions","remarks","isconvicted"})
    private Citizen citizen;



    // Employee Relationship

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;




    public Integer getId() {
        return id;
    }


    public void setId(Integer id) {
        this.id = id;
    }


    public String getDeedno() {
        return deedno;
    }


    public void setDeedno(String deedno) {
        this.deedno = deedno;
    }


    public Integer getTreecount() {
        return treecount;
    }


    public void setTreecount(Integer treecount) {
        this.treecount = treecount;
    }


    public String getReasonforcutting() {
        return reasonforcutting;
    }


    public void setReasonforcutting(String reasonforcutting) {
        this.reasonforcutting = reasonforcutting;
    }


    public Timestamp getRequesteddate() {
        return requesteddate;
    }


    public void setRequesteddate(Timestamp requesteddate) {
        this.requesteddate = requesteddate;
    }


    public String getRejectreason() {
        return rejectreason;
    }


    public void setRejectreason(String rejectreason) {
        this.rejectreason = rejectreason;
    }


    public byte[] getPermitpdf() {
        return permitpdf;
    }


    public void setPermitpdf(byte[] permitpdf) {
        this.permitpdf = permitpdf;
    }


    public byte[] getTransportpdf() {
        return transportpdf;
    }


    public void setTransportpdf(byte[] transportpdf) {
        this.transportpdf = transportpdf;
    }


    public Boolean getNeedstransport() {
        return needstransport;
    }


    public void setNeedstransport(Boolean needstransport) {
        this.needstransport = needstransport;
    }


    public String getDestination() {
        return destination;
    }


    public void setDestination(String destination) {
        this.destination = destination;
    }


    public String getVehicletype() {
        return vehicletype;
    }


    public void setVehicletype(String vehicletype) {
        this.vehicletype = vehicletype;
    }


    public String getVehiclenumber() {
        return vehiclenumber;
    }


    public void setVehiclenumber(String vehiclenumber) {
        this.vehiclenumber = vehiclenumber;
    }


    public String getTransportdate() {
        return transportdate;
    }


    public void setTransportdate(String transportdate) {
        this.transportdate = transportdate;
    }


    public Timestamp getTreecuttingrequestcol() {
        return treecuttingrequestcol;
    }


    public void setTreecuttingrequestcol(Timestamp treecuttingrequestcol) {
        this.treecuttingrequestcol = treecuttingrequestcol;
    }


    public Treetype getTreetype() {
        return treetype;
    }


    public void setTreetype(Treetype treetype) {
        this.treetype = treetype;
    }


    public Treepermissionstatus getTreepermissionstatus() {
        return treepermissionstatus;
    }


    public void setTreepermissionstatus(Treepermissionstatus treepermissionstatus) {
        this.treepermissionstatus = treepermissionstatus;
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



    @Override
    public boolean equals(Object o) {

        if (this == o)
            return true;

        if (o == null || getClass() != o.getClass())
            return false;

        Treecuttingrequest that = (Treecuttingrequest) o;

        return Objects.equals(id, that.id)
                && Objects.equals(deedno, that.deedno)
                && Objects.equals(treecount, that.treecount)
                && Objects.equals(reasonforcutting, that.reasonforcutting)
                && Objects.equals(requesteddate, that.requesteddate)
                && Objects.equals(rejectreason, that.rejectreason);
    }


    @Override
    public int hashCode() {

        return Objects.hash(
                id,
                deedno,
                treecount,
                reasonforcutting,
                requesteddate,
                rejectreason
        );
    }
}

//package lk.earth.earthuniversity.entity;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//
//import javax.persistence.*;
//import java.util.Collection;
//import java.util.Objects;
//
//@Entity
//public class Treecuttingrequest {
//
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Id
//    @Column(name = "id")
//    private Integer id;
//
//    @Basic
//    @Column(name = "name")
//    private String name;
//
//    @JsonIgnore
//    @OneToMany(mappedBy = "treepermissionstatus")
//    private Collection<Treecuttingrequest> treecuttingrequests;
//
//    public Treecuttingrequest() {}
//
//    public Treecuttingrequest(Integer id, String name) {
//        this.id = id;
//        this.name = name;
//    }
//
//    public Integer getId() { return id; }
//    public void setId(Integer id) { this.id = id; }
//
//    public String getName() { return name; }
//    public void setName(String name) { this.name = name; }
//
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        Treecuttingrequest that = (Treecuttingrequest) o;
//        return Objects.equals(id, that.id) && Objects.equals(name, that.name);
//    }
//
//    @Override
//    public int hashCode() { return Objects.hash(id, name); }
//
//    public Collection<Treecuttingrequest> getTreecuttingrequests() { return treecuttingrequests; }
//    public void setTreecuttingrequests(Collection<Treecuttingrequest> t) { this.treecuttingrequests = t; }
//}