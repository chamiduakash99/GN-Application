package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Collection;
import java.util.Objects;

@Entity
@Table(name = "`Usage`")
public class Usage {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;
//    @JsonIgnore
//    @OneToMany(mappedBy = "usage")
//    private Collection<Building> buildings;
//    public Collection<Building> getBuildings() {
//        return buildings;
//    }
//
//    public void setBuildings(Collection<Building> buildings) {
//        this.buildings = buildings;
//    }
    @JsonIgnore
    @OneToMany(mappedBy = "usage")
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
        Usage usage = (Usage) o;
        return Objects.equals(id, usage.id) && Objects.equals(name, usage.name);
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
