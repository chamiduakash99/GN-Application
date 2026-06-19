package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.sql.Date;
import java.util.Collection;

@Entity
public class Citizen {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "nic")
    private String nic;
    @JsonIgnore
    @OneToMany(mappedBy = "citizen")
    private Collection<Land> lands;
    @JsonIgnore
    @OneToMany(mappedBy = "citizen")
    private Collection<Landdetail> landdetails;
    @Basic
    @Column(name = "namewithinitials")
    private String namewithinitials;
    @Basic
    @Column(name = "dateofbirth")
    private Date dateofbirth;
    @Basic
    @Column(name = "mobileno")
    private String mobileno;
    @Basic
    @Column(name = "email")
    private String email;
    @Basic
    @Column(name = "isconvicted")
    private Byte isconvicted;
    @Basic
    @Column(name = "medicalconditions")
    private String medicalconditions;
    @Basic
    @Column(name = "remarks")
    private String remarks;
    @ManyToOne
    @JoinColumn(name = "religion_id", referencedColumnName = "id", nullable = false)
    private Religion religion;
    @ManyToOne
    @JoinColumn(name = "matiralStatus_id", referencedColumnName = "id", nullable = false)
    private Matiralstatus matiralstatus;
    @ManyToOne
    @JoinColumn(name = "educationLevel_id", referencedColumnName = "id", nullable = false)
    private Educationlevel educationlevel;
    @ManyToOne
    @JoinColumn(name = "ethnicity_id", referencedColumnName = "id", nullable = false)
    private Ethnicity ethnicity;
    @ManyToOne
    @JoinColumn(name = "gender_id", referencedColumnName = "id", nullable = false)
    private Gender gender;

    @OneToMany(mappedBy = "citizen", cascade = CascadeType.ALL,orphanRemoval = true)
    private Collection<Citizenaidprogram> citizenaidprograms;

    @OneToMany(mappedBy = "citizen", cascade = CascadeType.ALL,orphanRemoval = true)
    private Collection<Citizenguardian> citizenguardians;
    @JsonIgnore
    @OneToMany(mappedBy = "citizenparent")
    private Collection<Citizenguardian> citizenguardianparents;
    @Basic
    @Column(name = "birthcetificateno")
    private String birthcetificateno;

    public int getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Citizen citizen = (Citizen) o;

        if (id != citizen.id) return false;
        if (name != null ? !name.equals(citizen.name) : citizen.name != null) return false;
        if (nic != null ? !nic.equals(citizen.nic) : citizen.nic != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (nic != null ? nic.hashCode() : 0);
        return result;
    }

    public Collection<Land> getLands() {
        return lands;
    }

    public void setLands(Collection<Land> lands) {
        this.lands = lands;
    }

    public Collection<Landdetail> getLanddetails() {
        return landdetails;
    }

    public void setLanddetails(Collection<Landdetail> landdetails) {
        this.landdetails = landdetails;
    }

    public String getNamewithinitials() {
        return namewithinitials;
    }

    public void setNamewithinitials(String namewithinitials) {
        this.namewithinitials = namewithinitials;
    }

    public Date getDateofbirth() {
        return dateofbirth;
    }

    public void setDateofbirth(Date dateofbirth) {
        this.dateofbirth = dateofbirth;
    }

    public String getMobileno() {
        return mobileno;
    }

    public void setMobileno(String mobileno) {
        this.mobileno = mobileno;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Byte getIsconvicted() {
        return isconvicted;
    }

    public void setIsconvicted(Byte isconvicted) {
        this.isconvicted = isconvicted;
    }

    public String getMedicalconditions() {
        return medicalconditions;
    }

    public void setMedicalconditions(String medicalconditions) {
        this.medicalconditions = medicalconditions;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public Religion getReligion() {
        return religion;
    }

    public void setReligion(Religion religion) {
        this.religion = religion;
    }

    public Matiralstatus getMatiralstatus() {
        return matiralstatus;
    }

    public void setMatiralstatus(Matiralstatus matiralstatus) {
        this.matiralstatus = matiralstatus;
    }

    public Educationlevel getEducationlevel() {
        return educationlevel;
    }

    public void setEducationlevel(Educationlevel educationlevel) {
        this.educationlevel = educationlevel;
    }

    public Ethnicity getEthnicity() {
        return ethnicity;
    }

    public void setEthnicity(Ethnicity ethnicity) {
        this.ethnicity = ethnicity;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Collection<Citizenaidprogram> getCitizenaidprograms() {
        return citizenaidprograms;
    }

    public void setCitizenaidprograms(Collection<Citizenaidprogram> citizenaidprograms) {
        this.citizenaidprograms = citizenaidprograms;
    }

    public Collection<Citizenguardian> getCitizenguardians() {
        return citizenguardians;
    }

    public void setCitizenguardians(Collection<Citizenguardian> citizenguardians) {
        this.citizenguardians = citizenguardians;
    }

    public Collection<Citizenguardian> getCitizenguardianparents() {
        return citizenguardianparents;
    }

    public void setCitizenguardianparents(Collection<Citizenguardian> citizenguardianparents) {
        this.citizenguardianparents = citizenguardianparents;
    }

    public String getBirthcetificateno() {
        return birthcetificateno;
    }

    public void setBirthcetificateno(String birthcetificateno) {
        this.birthcetificateno = birthcetificateno;
    }
}
