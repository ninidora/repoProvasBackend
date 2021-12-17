import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import disciplinasEntity from '../entities/disciplinas';
import ProfDisEntity from '../entities/profDis';
import profDisEntity from '../entities/profDis';
import ProfessoresEntity from '../entities/professores';
import { getManager } from 'typeorm';
import ProvaEntity from '../entities/Provas';
import NotFoundError from '../errors/notFoundError';
import { Prova } from '../interfaces/provaInterface';

async function getProvas(id: number) {
  const result = getManager().query(
    `SELECT * FROM provas
  JOIN "profDis" ON provas."profDisId" = "profDis".id
  JOIN professores ON "profDis"."professoresId" = professores.id
  JOIN disciplinas ON "profDis"."disciplinasId" = disciplinas.id
  WHERE professores.id = $1`,
    [Number(id)],
  );

  return result;
}

async function getDisciplinas() {
  const disciplinas = await getRepository(disciplinasEntity).find({
    select: ['id', 'nomeDisciplina', 'periodoDisciplina'],
  });

  return disciplinas;
}

async function getProfessores() {
  const professores = await getRepository(ProfessoresEntity).find();

  return professores;
}

async function getProfessoresDaDisciplina(id: number) {
  const professoresDaDisciplina = await getRepository(profDisEntity).find({
    where: { disciplinasId: Number(id) },
    relations: ['professores'],
    select: ['id'],
  });

  return professoresDaDisciplina;
}

async function postProva({
  nomeProva,
  professorId,
  disciplinaId,
  linkProva,
  categoriasId,
}: Prova) {
  const profDis = await getRepository(ProfDisEntity).find({
    where: { disciplinasId: disciplinaId, professoresId: professorId },
  });
  const profDisId = profDis[0].id;
  const prova = await getRepository(ProvaEntity).insert({
    nomeProva,
    categoriasId,
    linkProva,
    profDisId,
  });

  return prova;
}

export {
  getProvas,
  getDisciplinas,
  getProfessores,
  getProfessoresDaDisciplina,
  postProva,
};
