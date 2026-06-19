package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Buildingtype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuildingtypeDao extends JpaRepository<Buildingtype, Integer> {

    Buildingtype findByName(String name);

}