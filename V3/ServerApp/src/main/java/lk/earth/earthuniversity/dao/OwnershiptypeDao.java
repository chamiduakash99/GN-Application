package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Ownershiptype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnershiptypeDao extends JpaRepository<Ownershiptype, Integer> {

    Ownershiptype findByName(String name);

}