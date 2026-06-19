package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Relationshiptype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RelationshiptypeDao extends JpaRepository<Relationshiptype, Integer> {

    Relationshiptype findByName(String name);
}