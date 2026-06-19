package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Collection;

@Entity
public class Landfeature {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "name")
    private String name;
    @JsonIgnore
    @OneToMany(mappedBy = "landfeature")
    private Collection<Landfeaturedetails> landfeaturedetails;
    @JsonIgnore
    @OneToMany(mappedBy = "landfeature")
    private Collection<LandfeatureHasLanddetail> landfeaturelanddetails;

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

        Landfeature that = (Landfeature) o;

        if (id != that.id) return false;
        if (name != null ? !name.equals(that.name) : that.name != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        return result;
    }

    public Collection<Landfeaturedetails> getLandfeaturedetails() {
        return landfeaturedetails;
    }

    public void setLandfeaturedetails(Collection<Landfeaturedetails> landfeaturedetails) {
        this.landfeaturedetails = landfeaturedetails;
    }

    public Collection<LandfeatureHasLanddetail> getLandfeaturelanddetails() {
        return landfeaturelanddetails;
    }

    public void setLandfeaturelanddetails(Collection<LandfeatureHasLanddetail> landfeaturelanddetails) {
        this.landfeaturelanddetails = landfeaturelanddetails;
    }
}
