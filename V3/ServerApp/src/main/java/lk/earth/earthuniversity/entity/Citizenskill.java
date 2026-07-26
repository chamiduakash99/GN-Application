package lk.earth.earthuniversity.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
public class Citizenskill {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;


    @Basic
    @Column(name = "experience_years")
    private Integer experienceyears;


    @ManyToOne
    @JoinColumn(
            name = "citizen_id",
            referencedColumnName = "id",
            nullable = false
    )
    private Citizen citizen;


    @ManyToOne
    @JoinColumn(
            name = "profession_id",
            referencedColumnName = "id",
            nullable = false
    )
    private Profession profession;


    public Citizenskill() {}


    public Citizenskill(Integer id, Integer experienceyears) {
        this.id = id;
        this.experienceyears = experienceyears;
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    public Integer getExperienceyears() {
        return experienceyears;
    }

    public void setExperienceyears(Integer experienceyears) {
        this.experienceyears = experienceyears;
    }


    public Citizen getCitizen() {
        return citizen;
    }

    public void setCitizen(Citizen citizen) {
        this.citizen = citizen;
    }


    public Profession getProfession() {
        return profession;
    }

    public void setProfession(Profession profession) {
        this.profession = profession;
    }


    @Override
    public boolean equals(Object o) {

        if (this == o) return true;

        if (o == null || getClass() != o.getClass())
            return false;

        Citizenskill that = (Citizenskill) o;

        return Objects.equals(id, that.id);
    }


    @Override
    public int hashCode() {
        return Objects.hash(id);
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
//public class Citizenskill {
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
//    @OneToMany(mappedBy = "profession")
//    private Collection<Citizenskill> citizenskills;
//
//    public Citizenskill() {}
//
//    public Citizenskill(Integer id, String name) {
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
//    public Collection<Citizenskill> getCitizenskills() { return citizenskills; }
//    public void setCitizenskills(Collection<Citizenskill> citizenskills) {
//        this.citizenskills = citizenskills;
//    }
//
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        Citizenskill that = (Citizenskill) o;
//        return Objects.equals(id, that.id) && Objects.equals(name, that.name);
//    }
//
//    @Override
//    public int hashCode() { return Objects.hash(id, name); }
//}