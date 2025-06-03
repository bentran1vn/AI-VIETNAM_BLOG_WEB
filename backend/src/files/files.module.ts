import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesResolver } from './files.resolver';
import { GitHubService } from './github.service';
import { LocalStorageService } from './local-storage.service';

@Module({
  providers: [FilesService, FilesResolver, GitHubService, LocalStorageService],
  exports: [FilesService],
})
export class FilesModule {}
