package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Collection;

@Entity
public class Fencetype {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "name")
    private String name;
    @JsonIgnore
    @OneToMany(mappedBy = "fencetype")
    private Collection<Land> lands;
    @JsonIgnore
    @OneToMany(mappedBy = "fencetype")
    private Collection<Landdetail> landdetails;

    public int getId() {
        return id;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Fencetype fencetype = (Fencetype) o;

        if (id != fencetype.id) return false;
        if (name != null ? !name.equals(fencetype.name) : fencetype.name != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (name != null ? name.hashCode() : 0);
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
}
