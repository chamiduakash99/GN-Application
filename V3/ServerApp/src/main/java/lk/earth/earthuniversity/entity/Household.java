package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Household {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "householdno")
    private String householdno;
    @Basic
    @Column(name = "address")
    private String address;
    @Basic
    @Column(name = "registrationdate")
    private Date registrationdate;
    @Basic
    @Column(name = "headcitizen_id")
    private Integer headcitizenId;
    @JsonIgnore
    @OneToMany(mappedBy = "household")
    private Collection<Citizen> citizensById;

    public Household() {
    }

    public Household(Integer id, String householdno) {
        this.id = id;
        this.householdno = householdno;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getHouseholdno() {
        return householdno;
    }

    public void setHouseholdno(String householdno) {
        this.householdno = householdno;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Date getRegistrationdate() {
        return registrationdate;
    }

    public void setRegistrationdate(Date registrationdate) {
        this.registrationdate = registrationdate;
    }

    public Integer getHeadcitizenId() {
        return headcitizenId;
    }

    public void setHeadcitizenId(Integer headcitizenId) {
        this.headcitizenId = headcitizenId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Household household = (Household) o;
        return Objects.equals(id, household.id) && Objects.equals(householdno, household.householdno) && Objects.equals(address, household.address) && Objects.equals(registrationdate, household.registrationdate) && Objects.equals(headcitizenId, household.headcitizenId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, householdno, address, registrationdate, headcitizenId);
    }

    public Collection<Citizen> getCitizensById() {
        return citizensById;
    }

    public void setCitizensById(Collection<Citizen> citizensById) {
        this.citizensById = citizensById;
    }
}
