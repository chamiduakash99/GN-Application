package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Walltype {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;
//    @JsonIgnore
//    @OneToMany(mappedBy = "walltype")
//    private Collection<Building> buildingsById;
//    public Collection<Building> getBuildingsById() {
//        return buildingsById;
//    }
//
//    public void setBuildingsById(Collection<Building> buildingsById) {
//        this.buildingsById = buildingsById;
//    }
    @JsonIgnore
    @OneToMany(mappedBy = "walltype")
    private Collection<Building> buildings;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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
        Walltype walltype = (Walltype) o;
        return Objects.equals(id, walltype.id) && Objects.equals(name, walltype.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    public Collection<Building> getBuildings() {
        return buildings;
    }

    public void setBuildings(Collection<Building> buildings) {
        this.buildings = buildings;
    }
}
