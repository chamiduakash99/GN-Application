package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Rooftype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RooftypeDao extends JpaRepository<Rooftype, Integer> {

    Rooftype findByName(String name);

}